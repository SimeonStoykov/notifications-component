import chaos from 'chaosocket';

const MIN_EXPIRE = 10000;
const MAX_EXPIRE = 30000;

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 10
        }),
        type: 'text',
        title: faker.lorem.sentence(),
        text: faker.lorem.sentence(),
        expires: faker.random.arrayElement([faker.random.number({ min: MIN_EXPIRE, max: MAX_EXPIRE }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 11,
            max: 20
        }),
        type: 'bonus',
        title: faker.lorem.sentence(),
        requirement: faker.lorem.sentence(),
        expires: faker.random.arrayElement([faker.random.number({ min: MIN_EXPIRE, max: MAX_EXPIRE }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 21,
            max: 30
        }),
        type: 'promotion',
        image: faker.image.image(),
        title: faker.lorem.sentence(),
        link: faker.internet.url(),
        expires: faker.random.arrayElement([faker.random.number({ min: MIN_EXPIRE, max: MAX_EXPIRE }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 30
        }),
        type: 'remove-notification'
    };
}, 'low');

chaos.listen({
    delay: 5000
});