import chaos from 'chaosocket';

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 20
        }),
        type: 'text',
        title: faker.lorem.sentence(),
        text: faker.lorem.sentences(),
        expires: faker.random.arrayElement([faker.random.number({ min: 30, max: 120 }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 21,
            max: 40
        }),
        type: 'bonus',
        title: faker.lorem.sentence(),
        requirement: faker.lorem.sentences(),
        expires: faker.random.arrayElement([faker.random.number({ min: 30, max: 120 }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 41,
            max: 60
        }),
        type: 'promotion',
        image: faker.image.image(),
        title: faker.lorem.sentence(),
        link: faker.internet.url(),
        expires: faker.random.arrayElement([faker.random.number({ min: 30, max: 120 }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 60
        }),
        type: 'remove-notification'
    };
}, 'low');

chaos.listen({
    delay: 5000
});