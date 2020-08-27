"use strict";

module.exports = (sequelize, DataTypes) => {
    const TmOndemandexTask = sequelize.define("tm_device", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        task_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_task_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        task_type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        executed_times: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        encrypt_flag: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        max_executed_times: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedule_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        target: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        policy_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        task_info: {
            type: DataTypes.STRING,
            allowNull: true
        },
        target_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        target_description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        task_parameter: {
            type: DataTypes.STRING,
            allowNull: true
        },
        delegator_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        heartbeat_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        lastupdate_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
    return TmOndemandexTask;
};
