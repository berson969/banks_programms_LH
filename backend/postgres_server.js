/* global process */
import express from 'express';
import {DataTypes, Op, Sequelize} from 'sequelize';
import bcrypt from 'bcryptjs';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());

// Инициализация PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME || 'table-db',
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
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    values: {
        type: DataTypes.JSONB,
        defaultValue: []
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

const CellValues = sequelize.define('CellValues', {
    rowId: {
        type: DataTypes.UUID,
        references: {
            model: Row,
            key: 'id'
        },
        allowNull: false,
        primaryKey: true
    },
    columnId: {
        type: DataTypes.UUID,
        references: {
            model: Column,
            key: 'id'
        },
        allowNull: false,
        primaryKey: true
    },
    cellValue: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
})

// Устанавливаем связи
Column.hasMany(CellValues, { foreignKey: 'columnId' });
Row.hasMany(CellValues, { foreignKey: 'rowId', as: 'cellValues' })
CellValues.belongsTo(Column, { foreignKey: 'columnId' });
CellValues.belongsTo(Row, { foreignKey: 'rowId' });

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
            order: [['createdAt', 'DESC']]
        });
        res.json(columns);
    } catch (error) {
        console.error('Error fetching columns:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/columns', async (req, res) => {
    try {
        const newColumn = await Column.create(req.body);
        res.json(newColumn);
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
            const newValues = req.body.values || [];
            console.log('newValues', req.body)
            await Column.update(
                { values: newValues },
                { where: { id: req.params.id } }
            );
            await CellValues.update(
                { cellValue: '' },
                {
                    where: {
                        columnId: req.params.id,
                        cellValue: { [Op.notIn]: newValues }
                    }
                });

            const updatedColumn = await Column.findByPk(req.params.id,);
            console.log('updatedColumn', updatedColumn)
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
        const deleted = await Column.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            await CellValues.update(
                { cellValue: '' },
                { where: { columnId: req.params.id } }
            );

            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Column not found' });
        }
    } catch (error) {
        console.error('Error deleting column:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/rows', async (req, res) => {
    try {
        const rows = await Row.findAll({
            include: [{
                model: CellValues,
                as: 'cellValues'
            }],
            order: [['createdAt', 'ASC']]
        });
        const formattedRows = rows.map(row => {
            return {
                id: row.id,
                createdAt: row.createdAt,
                cellValues: row.cellValues
            };
        });
        res.json(formattedRows);
    } catch (error) {
        console.error('Error fetching rows:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/rows', async (req, res) => {
    try {
        const newRow = await Row.create(req.body);

        if (req.body.cellValues) {

            const cellValuesArray = Object.entries(req.body.cellValues).map(([columnId, value]) => ({
                rowId: newRow.id,
                columnId: columnId,
                cellValue: value
                })
            )
            await CellValues.bulkCreate(cellValuesArray);
        }
        const createdRow = await Row.findByPk(newRow.id, {
            include: [{
                model: CellValues,
                as: 'cellValues'
            }]
        });
        console.log('createdRow', createdRow);
        res.json(createdRow);
    } catch (error) {
        console.error('Error adding row:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/rows/:id', async (req, res) => {
    try {
        const {rowId, columnId, value} = req.body
        const updateRow = await Row.findByPk(req.params.id);

        if (updateRow) {
            await CellValues.upsert({
                rowId,
                columnId,
                cellValue: value
            });
            const updatedRows = await Row.findAll( {
                include: [{
                    model: CellValues,
                    as: 'cellValues'
                }]
            });
            res.json(updatedRows);
            console.log('updatedRow', updatedRows);
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

        await CellValues.destroy({
            where: { rowId: req.params.id }
        });

        const deleted = await Row.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            const updatedRows = await Row.findAll( {
                include: [{
                    model: CellValues,
                    as: 'cellValues'
                }]
            });
            res.json(updatedRows);
            console.log('deletedRow', updatedRows);
        } else {
            res.status(404).json({ message: 'Row not found' });
        }
    } catch (error) {
        console.error('Error deleting row:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
