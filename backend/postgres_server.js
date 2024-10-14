/* global process */
import express from 'express';
import {DataTypes, Op, Sequelize} from 'sequelize';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import cors from 'cors';


const app = express();
app.use(cors({
    origin: [ 'http://localhost:5173', 'http://91.109.202.105', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'XSRF-TOKEN']
}));
app.use(express.json());

// Инициализация PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME || 'table-db-new',
    process.env.DB_USER || 'some_user',
    process.env.DB_PASS || 'secret',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Определение модели для колонок
const Column = sequelize.define('Column', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

const Addition = sequelize.define('Addition', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    valuesId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    additionValue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typeValue: {
        type: DataTypes.ENUM('email', 'url', 'text'),
        allowNull: false
    }
}, {
    hooks: {
        beforeValidate: (addition) => {
            const value = addition.additionValue;
            const type = addition.typeValue;

            if (type === 'email') {
                // Встроенная проверка на email
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email format');
                }
            } else if (type === 'link') {
                // Встроенная проверка на URL
                if (!validator.isURL(value)) {
                    throw new Error('Invalid URL format');
                }
            }
        }
    }
});

const Values = sequelize.define('Values', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    columnId: {
        type: DataTypes.UUID,
        references: {
            model: Column,
            key: 'id'
        },
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
});

// Определение модели для строк
const Row = sequelize.define('Row', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

const Cells = sequelize.define('Cells', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    rowId: {
        type: DataTypes.UUID,
        references: {
            model: Row,
            key: 'id'
        },
        allowNull: false,
    },
    columnId: {
        type: DataTypes.UUID,
        references: {
            model: Column,
            key: 'id'
        },
        allowNull: false,
    },
    valuesId: {
        type: DataTypes.UUID,
        references: {
            model: Values,
            key: 'id'
        },
        allowNull: false
    }
})

// Устанавливаем связи
Column.hasMany(Cells, { foreignKey:'columnId' });
Column.hasMany(Values, { foreignKey:'columnId' });

Row.hasMany(Cells, { foreignKey:'rowId', as:'cellValues' });
Values.hasMany(Cells, { foreignKey:'valuesId' });

Values.belongsTo(Column, { foreignKey:'columnId' });
Cells.belongsTo(Column, { foreignKey:'columnId' });
Cells.belongsTo(Row, { foreignKey:'rowId' });
Cells.belongsTo(Values, { foreignKey:'valuesId' });

Values.hasMany(Addition, { foreignKey:'valuesId', as: "addition", onDelete: 'CASCADE' });
Addition.belongsTo(Values, { foreignKey:'valuesId', as: 'addition', onDelete: 'CASCADE' });

// Синхронизация моделей с базой данных
sequelize.sync().then(() => {
    console.log('Database and tables created!');
}).catch(err => {
    console.error('Error syncing database:', err);
});


// API endpoints
app.post('/api/password', async (req, res) => {
    try {
        const users = {
            "$2b$10$YVGBecVKMMjUHtEuLY3ZU.vPFXzLchmnuTrdnhNQZq.D9kGxY7RKa": 'user', //user32
            "$2b$10$EOt74iiHwVWDWM/Z/SOYP.QfJ.q2x5CUBJ7.4nWRrsFZlC/QTVQe6": 'admin' //ilyaLH
        }
        const { password } = req.body;

        for (const [hash, role] of Object.entries(users)) {
            const match =  await bcrypt.compare(password, hash);
            if (match) return res.json({ role });
        }
        res.json({ role: '' });
    } catch (error) {
        console.error('Error password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/columns', async (req, res) => {
    try {
        const columns = await Column.findAll({
            include: [{
                model: Values,
                required: false,
                include: [{
                    model: Addition,
                    as: 'addition',
                    required: false
                }]
            }]
        });
        res.json(columns);
    } catch (error) {
        console.error('Error fetching columns:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/columns', async (req, res) => {
    try {
        const column = await Column.create();
        const newColumn = await Column.findByPk(column.id,
            {
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            }
        );

        res.status(201).json(newColumn);
    } catch (error) {
        console.error('Error adding column:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/columns/:id', async (req, res) => {
    try {
        const [updated] = await Column.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedColumn = await Column.findByPk(req.params.id,
                {
                    include: [{
                        model: Values,
                        required: false,
                        include: [{
                            model: Addition,
                            as: 'addition',
                            required: false
                        }]
                    }]
                });
            res.json(updatedColumn);
        } else {
            res.status(404).json({ message: 'Column not found' });
        }
    } catch (error) {
        console.error('Error updating column:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/columns/:id', async (req, res) => {
    try {
        const values = await Values.findAll({ where: { columnId: req.params.id } });
        const valueIds = values.map(value => value.id);

        if (valueIds.length > 0) {
            await Values.destroy({
                where: {id: {
                    [Op.in]: valueIds
                    }}
            });
        }

        const deleted = await Column.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            await Cells.destroy(
                { where: { columnId: req.params.id } }
            );
            const updatedColumns = await Column.findAll({
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            });
            res.json(updatedColumns);
        } else {
            res.status(404).json({ message: 'Column not found' });
        }
    } catch (error) {
        console.error('Error deleting column:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/values/', async (req, res) => {
    try {
        const updated = await Column.findByPk(req.body.columnId);
        if (updated) {
            const newValue = await Values.create({
               id: req.body.id,
               columnId: req.body.columnId,
               value: req.body.value,
            });
            const updatedColumns = await Column.findAll({
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            });
            res.json(updatedColumns);
        } else {
            res.status(404).json({ message: 'Column not found' });
        }
    } catch (error) {
        console.error('Error create value:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/values/:id', async (req, res) => {
    try {
        const updateValue = await Values.findByPk(req.params.id);

        if (!updateValue) {
            return res.status(404).json({ message: 'Value not found' });
        }

        const cellsToUpdate = await Cells.findAll({
            where: { valuesId: updateValue.id }
        });

        if (cellsToUpdate.length > 0) {
            await Cells.update(
                { value: req.body.value },
                { where: { valuesId: updateValue.id }
            })
        };
        updateValue.value = req.body.value;
        await updateValue.save();
        const updatedColumns = await Column.findAll({
            include: [{
                model: Values,
                required: false,
                include: [{
                    model: Addition,
                    as: 'addition',
                    required: false
                }]
            }]
        });
        res.json(updatedColumns);
    }  catch (error) {
        console.error('Error update value:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/values/:id', async (req, res) => {
    try {
        const value = await Values.findByPk(req.params.id, {
            include: [{
                model: Addition,
                as: 'addition',
            }]
        });

        if (!value) {
            return res.status(404).json({ message: 'Value not found' });
        }

        await Cells.destroy({
            where: { valuesId: value.id }
        })

        const deleted = await Values.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            const updatedColumns = await Column.findAll({
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            });
            res.json(updatedColumns);
        } else {
            res.status(404).json({ message: 'Value not found' });
        }

    } catch (error) {
        console.error('Error delete value:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/rows', async (req, res) => {
    try {
        const rows = await Row.findAll({
            include: [{
                model: Cells,
                as: 'cellValues',
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            }]
        });
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rows:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/rows', async (req, res) => {
    try {
        const rows = await Row.findAll({
            include: [{
                model: Cells,
                as: 'cellValues',
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            }]
        })
        const emptyRows = rows.filter(row => row.cellValues.length === 0);
        if (emptyRows.length > 0) {
            res.status(204).send();
        } else {
            const newRow = await Row.create();

            const createdRow = await Row.findByPk(newRow.id, {
                include: [{
                    model: Cells,
                    as: 'cellValues',
                    include: [{
                        model: Values,
                        required: false,
                        include: [{
                            model: Addition,
                            as: 'addition',
                            required: false
                        }]
                    }]
                }]
            });
            res.status(201).json(createdRow);
        }
    } catch (error) {
        console.error('Error adding row:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/rows/:id', async (req, res) => {
    try {

        const { columnId, valuesId } = req.body;

        const updateRow = await Row.findByPk(req.params.id);

        if (updateRow) {
            const [cell] = await Cells.findAll(
                { where: {
                    rowId: updateRow.id,
                    columnId: columnId,
                    valuesId: valuesId
                }}
            );
            if (!cell) {
                const createCell = await Cells.create({
                    rowId: updateRow.id,
                    columnId,
                    valuesId
                });
                const updatedRows = await Row.findAll( {
                    include: [{
                        model: Cells,
                        as: 'cellValues',
                        include: [{
                            model: Values,
                            required: false,
                            include: [{
                                model: Addition,
                                as: 'addition',
                                required: false
                            }]
                        }]
                    }]
                });
                res.json(updatedRows);
            } else {
                res.status(409).json({ message: 'Value already exits' });
            }
        } else {
            res.status(404).json({ message: 'Row not found' });
        }
    } catch (error) {
        console.error('Error updating row:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/rows/:id', async (req, res) => {
    try {
        await Cells.destroy({
            where: { rowId: req.params.id }
        });

        const deleted = await Row.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            const updatedRows = await Row.findAll( {
                include: [{
                    model: Cells,
                    as: 'cellValues',
                    include: [{
                        model: Values,
                        required: false,
                        include: [{
                            model: Addition,
                            as: 'addition',
                            required: false
                        }]
                    }]
                }]
            });
            res.json(updatedRows);
        } else {
            res.status(404).json({ message: 'Row not found' });
        }
    } catch (error) {
        console.error('Error deleting row:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/cells/:id', async (req, res) => {
    try {
        console.log("id Cell", req.params.id);
        const deleted = Cells.destroy({
            where: { id: req.params.id }
        });
        console.log("deleted", deleted);
        if (deleted) {
            const updatedRows = await Row.findAll( {
                include: [{
                    model: Cells,
                    as: 'cellValues',
                    include: [{
                        model: Values,
                        required: false,
                        include: [{
                            model: Addition,
                            as: 'addition',
                            required: false
                        }]
                    }]
                }]
            });
            res.json(updatedRows);
        } else {
            res.status(404).json({message: 'Cell not found'});
        }
    } catch (error) {
        console.error('Error deleting cell:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/addition', async (req, res) => {
    try {
        const { valuesId, additionValue, typeValue } = req.body;
        if (!valuesId || !additionValue || !typeValue) {
            return res.status(400).json({ message: 'Missing required fields: valuesId, additionValue, and type are required.' });
        };

        const currentAddition = await Addition.findOne({
            where: {
                valuesId: valuesId,
                additionValue: additionValue,
                typeValue: typeValue
            }
        });
        console.log("currentAddition", currentAddition);
        if (currentAddition) {
            return res.status(409).json({ message: 'Addition value already exists' });
        }

        const newAddition = await Addition.create(
            {
                valuesId,
                additionValue,
                typeValue
            }
        );
        console.log("newAddition", newAddition);
        const columns = await Column.findAll({
            include: [{
                model: Values,
                required: false,
                include: [{
                    model: Addition,
                    as: 'addition',
                    required: false
                }]
            }]
        });
        res.json(columns);
    } catch (error) {
        console.error('Error updating addition:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/addition/:id', async (req, res) => {
    try {
        const deleted = await Addition.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            const columns = await Column.findAll({
                include: [{
                    model: Values,
                    required: false,
                    include: [{
                        model: Addition,
                        as: 'addition',
                        required: false
                    }]
                }]
            });
            res.json(columns);
        } else {
            res.status(404).json({message: 'Addition not found'});
        }
    } catch (error) {
        console.error('Error deleting addition:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.close(() => {
        console.log('Http server closed.');
        sequelize.close().then(() => {
            console.log('Database connection closed.');
            process.exit(0);
        }).catch((err) => {
            console.error('Error closing database connection:', err);
            process.exit(1);
        });
    });
});
