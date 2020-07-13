/**
 * Model Definition
 */
module.exports = {
    Model_ID: {
        type: 'string',
        primary: true,
    },
    name: {
        type: 'string',
        index: true,
    },
    is_of: {
        type: 'relationship',
        relationship: 'IS_OF',
        direction: 'out'
        }
    }
