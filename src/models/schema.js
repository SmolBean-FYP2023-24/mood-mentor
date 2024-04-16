export const schema = {
    "models": {
        "UserDataModel": {
            "name": "UserDataModel",
            "fields": {
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "streak": {
                    "name": "streak",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "level": {
                    "name": "level",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "badges": {
                    "name": "badges",
                    "isArray": false,
                    "type": {
                        "nonModel": "BadgeList"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "SpeakingQuestions": {
                    "name": "SpeakingQuestions",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ListeningQuestions": {
                    "name": "ListeningQuestions",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "CoversationQuestions": {
                    "name": "CoversationQuestions",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "HasOnboarded": {
                    "name": "HasOnboarded",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "SpeakingAccuracy": {
                    "name": "SpeakingAccuracy",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ListeningAccuracy": {
                    "name": "ListeningAccuracy",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ConversationAccuracy": {
                    "name": "ConversationAccuracy",
                    "isArray": false,
                    "type": {
                        "nonModel": "EmotionStats"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "UserDataModels",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "fields": [
                            "username"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {},
    "nonModels": {
        "EmotionStats": {
            "name": "EmotionStats",
            "fields": {
                "Happy": {
                    "name": "Happy",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Sad": {
                    "name": "Sad",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Angry": {
                    "name": "Angry",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Fear": {
                    "name": "Fear",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Disgust": {
                    "name": "Disgust",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "Surprise": {
                    "name": "Surprise",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "BadgeList": {
            "name": "BadgeList",
            "fields": {
                "BadgeQuestion50": {
                    "name": "BadgeQuestion50",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeQuestion100": {
                    "name": "BadgeQuestion100",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeQuestion200": {
                    "name": "BadgeQuestion200",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeDayHalf": {
                    "name": "BadgeDayHalf",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeDayMonth": {
                    "name": "BadgeDayMonth",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeDayThreeMonths": {
                    "name": "BadgeDayThreeMonths",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeHappy40": {
                    "name": "BadgeHappy40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeSad40": {
                    "name": "BadgeSad40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeFear40": {
                    "name": "BadgeFear40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeDisgust40": {
                    "name": "BadgeDisgust40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeSurprise40": {
                    "name": "BadgeSurprise40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeAngry40": {
                    "name": "BadgeAngry40",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeHappy60": {
                    "name": "BadgeHappy60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeSad60": {
                    "name": "BadgeSad60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeFear60": {
                    "name": "BadgeFear60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeDisgust60": {
                    "name": "BadgeDisgust60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeSurprise60": {
                    "name": "BadgeSurprise60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "BadgeAngry60": {
                    "name": "BadgeAngry60",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            }
        }
    },
    "codegenVersion": "3.4.4",
    "version": "a99e6a8c054775d1a55cbf3a49169feb"
};