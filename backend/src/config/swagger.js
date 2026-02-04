import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Arohan Health API',
            version: '1.0.0',
            description: 'AI-Powered Wearable Emergency Detection & First Aid Platform API',
            contact: {
                name: 'Arohan Health Support',
                email: 'support@arohanhealth.com'
            },
            license: {
                name: 'Proprietary',
                url: 'https://arohanhealth.com/license'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.arohanhealth.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'fail'
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        user_id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        full_name: {
                            type: 'string'
                        },
                        email: {
                            type: 'string',
                            format: 'email'
                        },
                        role: {
                            type: 'string',
                            enum: ['patient', 'doctor', 'admin']
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                CartItem: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        },
                        description: {
                            type: 'string'
                        },
                        price: {
                            type: 'number'
                        },
                        quantity: {
                            type: 'integer'
                        },
                        image: {
                            type: 'string'
                        },
                        features: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                HealthVitals: {
                    type: 'object',
                    properties: {
                        heart_rate: {
                            type: 'integer',
                            minimum: 30,
                            maximum: 250
                        },
                        blood_pressure_systolic: {
                            type: 'integer',
                            minimum: 70,
                            maximum: 250
                        },
                        blood_pressure_diastolic: {
                            type: 'integer',
                            minimum: 40,
                            maximum: 150
                        },
                        oxygen_saturation: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100
                        },
                        temperature: {
                            type: 'number',
                            minimum: 35,
                            maximum: 43
                        },
                        recorded_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    },
                    required: ['heart_rate']
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
