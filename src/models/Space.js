/**
 * Space Definition
 */
module.exports =  {
    Number: {
        type: 'string',
    },
    name: {
        type: 'string',
        index: true,
    },
    bounded_by: {
        type: 'relationship',
        relationship: 'BOUNDED_BY',
        direction: 'out'
        }
    }
