'use strict';

// 必须使用这种方式导入才能正确注册任务
const buildTasks = require('./tasks/build');
const releaseTasks = require('./tasks/release');

// 将任务复制到gulp的全局作用域
Object.keys(buildTasks).forEach(taskName => {
  exports[taskName] = buildTasks[taskName];
});

Object.keys(releaseTasks).forEach(taskName => {
  exports[taskName] = releaseTasks[taskName];
});