'use strict';

/**
 * vault service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::vault.vault');
