import chaos from 'chaosocket';

const MIN_EXPIRE = 20000;
const MAX_EXPIRE = 60000;

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 3
        }),
        type: 'text',
        title: faker.lorem.sentence(),
        text: faker.lorem.sentence(),
        expires: null
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
        requirement: faker.lorem.sentence(),
        expires: faker.random.arrayElement([faker.random.number({ min: MIN_EXPIRE, max: MAX_EXPIRE }), null])
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
        expires: faker.random.arrayElement([faker.random.number({ min: MIN_EXPIRE, max: MAX_EXPIRE }), null])
    };
}, 'low');

chaos.register(faker => {
    return {
        id: faker.random.number({
            min: 1,
            max: 3
        }),
        type: 'remove-notification'
    };
}, 'low');

chaos.listen({
    delay: 5000
});