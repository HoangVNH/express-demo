const db = require('./models');
const models = db.sequelize.models;

async function initDataAsync() {
    const executedBy = '00000000-0000-0000-0000-000000000000';
    const executedTime = new Date();

    await initializingRolesAsync(executedBy, executedTime);
}

async function initializingRolesAsync(executedBy, executedTime) {
    const roleRepository = models.Role;
    const roles = await roleRepository.findAndCountAll();
    if (roles.count === 0) {
        await roleRepository.bulkCreate([
            {
                name: 'Administrator',
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
            {
                name: 'Bidder',
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
            {
                name: 'Saler',
                isActive: true,
                createdBy: executedBy,
                createdAt: executedTime,
                updatedAt: executedTime,
                updatedBy: executedBy,
            },
        ]);
    }
}

module.exports = initDataAsync;