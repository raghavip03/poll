import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addPoll, listPolls, getPoll, resestForTesting, advanceTimeForTesting } from './routes';


describe('routes', function() {

  it('addPoll', function() {
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {}});
      const res1 = httpMocks.createResponse();
      addPoll(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 400);
      assert.deepStrictEqual(res1._getData(),
          "missing 'name' parameter");

    const req2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/add', body: {name: "Favorite Food", options:["pizza", "burger"]}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      "'minutes' are not a number: undefined");

    const req3 = httpMocks.createRequest(
      {method: 'POST', url:'/api/add', body: {name: "Favorite Food", minutes: -1, options:["pizza", "burger"]}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
      "'minutes' are not a positive integer: -1");

    const req4 = httpMocks.createRequest(
      {method: 'POST', url:'/api/add', body: {name: "Favorite Food", minutes: 1, options: "pizza"}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
      "options are given in the wrong format");

    const req5 = httpMocks.createRequest(
      {method: 'POST', url:'/api/add', body: {name: "Favorite Drink", minutes: 4, options: ["juice", "lemonade", "soda"]}});
    const res5 = httpMocks.createResponse();
    addPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().poll.pollName, "Favorite Drink");
   const endTime5 = res5._getData().poll.endTime;
   assert.ok(Math.abs(endTime5 - Date.now() - 4 * 60 * 1000) < 50);
   assert.deepStrictEqual(res5._getData().poll.options, ["juice", "lemonade", "soda"]);

   const req6 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Drink", minutes: 5, options: ["water", "coffee", "tea"]}});
    const res6 = httpMocks.createResponse();
    addPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
    "poll for 'Favorite Drink' already exists");

   resestForTesting();

});
  it('listPoll', function() {
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res1 = httpMocks.createResponse();
    listPolls(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {polls: []});

  const req2 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Drink", minutes: 4, options: ["juice", "lemonade", "soda"]}});
  const res2 = httpMocks.createResponse();
  addPoll(req2, res2);
  assert.strictEqual(res2._getStatusCode(), 200);
  assert.deepStrictEqual(res2._getData().poll.pollName, "Favorite Drink");
  const endTime2 = res2._getData().poll.endTime;
  assert.ok(Math.abs(endTime2 - Date.now() - 4 * 60 * 1000) < 50);
  assert.deepStrictEqual(res2._getData().poll.options, ["juice", "lemonade", "soda"]);

  const req3 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Fruit", minutes: 5, options: ["mango", "grape", "berry"]}});
  const res3 = httpMocks.createResponse();
  addPoll(req3, res3);
  assert.strictEqual(res3._getStatusCode(), 200);
  assert.deepStrictEqual(res3._getData().poll.pollName, "Favorite Fruit");
  const endTime3 = res3._getData().poll.endTime;
  assert.ok(Math.abs(endTime3 - Date.now() - 5 * 60 * 1000) < 50);
  assert.deepStrictEqual(res3._getData().poll.options, ["mango", "grape", "berry"]);

  const req4 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Candy", minutes: 3, options: ["skittles", "starburst", "mentos"]}});
  const res4 = httpMocks.createResponse();
  addPoll(req4, res4);
  assert.strictEqual(res4._getStatusCode(), 200);
  assert.deepStrictEqual(res4._getData().poll.pollName, "Favorite Candy");
  const endTime4 = res4._getData().poll.endTime;
  assert.ok(Math.abs(endTime4 - Date.now() - 3 * 60 * 1000) < 50);
  assert.deepStrictEqual(res4._getData().poll.options, ["skittles", "starburst", "mentos"]);

  const req5 = httpMocks.createRequest(
    {method: 'GET', url: '/api/list', query: {}});
  const res5 = httpMocks.createResponse();
  listPolls(req5, res5);
  assert.strictEqual(res5._getStatusCode(), 200);
  assert.deepStrictEqual(res5._getData().polls.length, 3);
  assert.deepStrictEqual(res5._getData().polls[0].pollName, "Favorite Candy");
  assert.deepStrictEqual(res5._getData().polls[1].pollName, "Favorite Drink");
  assert.deepStrictEqual(res5._getData().polls[2].pollName, "Favorite Fruit");

  advanceTimeForTesting(5 * 60 * 1000 + 50);

  resestForTesting();
});

it('getPoll', function() {

  const req3 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Fruit", minutes: 5, options: ["mango", "grape", "berry"]}});
  const res3 = httpMocks.createResponse();
  addPoll(req3, res3);
  assert.strictEqual(res3._getStatusCode(), 200);
  assert.deepStrictEqual(res3._getData().poll.pollName, "Favorite Fruit");
  const endTime3 = res3._getData().poll.endTime;
  assert.ok(Math.abs(endTime3 - Date.now() - 5 * 60 * 1000) < 50);
  assert.deepStrictEqual(res3._getData().poll.options, ["mango", "grape", "berry"]);


  const req4 = httpMocks.createRequest(
    {method: 'POST', url:'/api/add', body: {name: "Favorite Candy", minutes: 3, options: ["skittles", "starburst", "mentos"]}});
  const res4 = httpMocks.createResponse();
  addPoll(req4, res4);
  assert.strictEqual(res4._getStatusCode(), 200);
  assert.deepStrictEqual(res4._getData().poll.pollName, "Favorite Candy");
  const endTime4 = res4._getData().poll.endTime;
  assert.ok(Math.abs(endTime4 - Date.now() - 3 * 60 * 1000) < 50);
  assert.deepStrictEqual(res4._getData().poll.options, ["skittles", "starburst", "mentos"]);

   const req5 = httpMocks.createRequest(
    {method: 'POST',url: '/api/get', body: {}});
    const res5 = httpMocks.createResponse();
    getPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
        "missing or invalid 'name' parameter");

    const req6 = httpMocks.createRequest(
    {method: 'POST',url: '/api/get', body: {name: "Favorite Season"}});
    const res6 = httpMocks.createResponse();
    getPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        "no poll with the name 'Favorite Season'");

  const req7 = httpMocks.createRequest(
    {method: 'POST', url: '/api/get', body: {name: "Favorite Fruit"}});
  const res7 = httpMocks.createResponse();
  getPoll(req7, res7);
  assert.strictEqual(res7._getStatusCode(), 200);
  assert.deepStrictEqual(res7._getData().poll.pollName, "Favorite Fruit");
  assert.deepStrictEqual(res7._getData().poll.options, ["mango", "grape", "berry"]);

  resestForTesting();
});

// // it("voteInPoll", function() {
//   const req1 = httpMocks.createRequest(
//     {method: 'POST', url:'/api/add', body: {name: "Favorite Fruit", minutes: 5, options: ["mango", "grape", "berry"]}});
//   const res1 = httpMocks.createResponse();
//   addPoll(req1, res1);
//   assert.strictEqual(res1._getStatusCode(), 200);
//   assert.deepStrictEqual(res1._getData().poll.pollName, "Favorite Fruit");
//   const endTime1 = res1._getData().poll.endTime;
//   assert.ok(Math.abs(endTime1 - Date.now() - 5 * 60 * 1000) < 50);
//   assert.deepStrictEqual(res1._getData().poll.options, ["mango", "grape", "berry"]);

//   const req2 = httpMocks.createRequest({
//     method: 'POST',
//     url: '/api/vote',
//     body: {voterName: "Jeff", pollName: "Favorite Fruit", optionName: "mango"},
//   });
//   const res2 = httpMocks.createResponse();
//   voteInPoll(req2, res2);
//   assert.strictEqual(res2._getStatusCode(), 200);
//   assert.deepStrictEqual(res2._getData().poll.voterName, "Jeff");
//   assert.deepStrictEqual(res2._getData().optionGiven.optionName, "mango");
//   assert.deepStrictEqual(res2._getData().optionGiven.percentage, 100);

//   const req3 = httpMocks.createRequest({
//     method: 'POST',
//     url: '/api/vote',
//     body: {voterName: "Max", pollName: "Favorite Fruit", optionName: "grape"},
//   });
//   const res3 = httpMocks.createResponse();
//   voteInPoll(req3, res3);
//   assert.strictEqual(res3._getStatusCode(), 200);
//   assert.deepStrictEqual(res3._getData().poll.voterName, "Max");
//   assert.deepStrictEqual(res3._getData().optionGiven.optionName, "grape");
//   assert.deepStrictEqual(res3._getData().optionGiven.percentage, 50);

//   const req4 = httpMocks.createRequest({
//     method: 'POST',
//     url: '/api/vote',
//     body: {voterName: "Sam", pollName: "Favorite Fruit", optionName: "grape"},
//   });
//   const res4 = httpMocks.createResponse();
//   voteInPoll(req4, res4);
//   assert.strictEqual(res4._getStatusCode(), 200);
//   assert.deepStrictEqual(res4._getData().poll.voterName, "Sam");
//   assert.deepStrictEqual(res4._getData().optionGiven.optionName, "grape");
//   assert.deepStrictEqual(res4._getData().optionGiven.percentage, 67);

//   const req5 = httpMocks.createRequest({
//     method: 'POST',
//     url: '/api/vote',
//     body: {voterName: "Fred", pollName: "Favorite Fruit", optionName: "berry"},
//   });
//   const res5 = httpMocks.createResponse();
//   voteInPoll(req5, res5);
//   assert.strictEqual(res5._getStatusCode(), 200);
//   assert.deepStrictEqual(res5._getData().poll.voterName, "Fred");
//   assert.deepStrictEqual(res5._getData().optionGiven.optionName, "berry");
//   assert.deepStrictEqual(res5._getData().optionGiven.percentage, 25);

//   advanceTimeForTesting(5 * 60 * 1000 + 50);
//   const req6 = httpMocks.createRequest({
//     method: 'POST',
//     url: '/api/vote',
//     body: {voterName: "Fred", pollName: "Favorite Fruit", optionName: "berry"},
//   });
//   const res6 = httpMocks.createResponse();
//   voteInPoll(req6, res6);
//   assert.strictEqual(res6._getStatusCode(), 400);
//   assert.deepStrictEqual(res6._getData(), "the poll 'Favorite Fruit' has ended, no more votes can be added");

});



