//imports the faker js library
const faker = require('faker/locale/en_us');

//imports the list of accepted categories
const list = require('../../src/categoryList');

//imports a list of starbucks for real addresses
const addressList = require('./starbucks_us_locations.json')

const getRandomPerson = function(){
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email();
    let avatar = faker.image.avatar();

    return ({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'avatar': avatar,
        'imageType': 'url'
    });
}

const getRandomBid = function(min, max){
    let amount = faker.finance.amount(min, max, 2);

    return ({
        'amount': amount
    });
}

const getRandomProd = function(){
    let productName = faker.commerce.productName();
    let department = null;
    let price = faker.commerce.price(10, 999, 2);
    let description = faker.lorem.sentences();
    let returnPolicy = faker.lorem.sentences();
    let endDate = faker.date.future();
    let location = addressList[Math.floor(Math.random()*addressList.length)].address;

    location = location.substr(location.indexOf("_")+1,location.length).split("_").join(" ");

    //logic to pull a random category
    let keys = Object.keys(list);
    //loops till an array is not picked
    do{
        department = list[keys[Math.floor(Math.random()*keys.length)]];
    }while(Array.isArray(department));

    return ({
        'productName': productName,
        'department': department,
        'price': price,
        'description': description,
        'returnPolicy': returnPolicy,
        'endDate': endDate,
        'location': location
    });
}

const getRandomQuestion = function(){
    let question = faker.hacker.phrase();

    question = question.replace(/.$/, "?");
    return ({
        'question': question
    });
}

const getRandomAnswer = function(){
    let answer = faker.hacker.phrase();

    return ({
        'answer': answer
    });
}

const getRandomProdImage = function(count){
    image = [];

    for(let i = 0; i < count; i++)
        image.push({
            'image':faker.random.image(),
            'imageType': 'url'
        });

    return (image);
}

module.exports = {
    'getRandomPerson':getRandomPerson,
    'getRandomBid':getRandomBid,
    'getRandomProd':getRandomProd,
    'getRandomQuestion':getRandomQuestion,
    'getRandomAnswer':getRandomAnswer,
    'getRandomProdImage':getRandomProdImage
}