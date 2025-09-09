import { computeComing } from "./util";


const allWeather = {
    weather: 100,
    willBring: 1
}

test('computeComing respects weather', () => {
    const computed = computeComing([{
        userName: "danny",
        weather: 60,
        willBring: 1,
        willComeIfAtLeast: 0
    },{
        userName: "bob",
        weather: 40,
        willBring: 1,
        willComeIfAtLeast: 0
    }], 50)
    expect(computed).toEqual({
        "danny": true,
        "bob": false,
    })
});

test('computeComing computes how many should come in obvious scenario', () => {
    const computed = computeComing([{
        userName: "danny",
        ...allWeather,
        willComeIfAtLeast: 0 // Danny's coming either way
    },{
        userName: "bob",
        ...allWeather,
        willComeIfAtLeast: 2 // Bob will come once he sees Danny
    },{
        userName: "sally",
        ...allWeather,
        willComeIfAtLeast: 3 // Sally will come if bob & danny show up.
    }], 50)
    expect(computed).toEqual({
        "danny": true,
        "bob": true,
        "sally": true,
    })
});

test('computeComing computes how many should come when multiple have to come at once', () => {
    // In this scenario, bob and sally both show up because they both make it 3 people.
    const computed = computeComing([{
        userName: "danny",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "bob",
        ...allWeather,
        willComeIfAtLeast: 3
    },{
        userName: "sally",
        ...allWeather,
        willComeIfAtLeast: 3
    }], 50)
    expect(computed).toEqual({
        "danny": true,
        "bob": true,
        "sally": true,
    })
});

test('computeComing works for just one response', () => {
    // In this scenario, bob and sally both show up because they both make it 3 people.
    const computed = computeComing([{
        userName: "danny",
        ...allWeather,
        willComeIfAtLeast: 0
    }], 50)
    expect(computed).toEqual({
        "danny": true,
    })
});

test('computeComing doesnt sign up people when there arent enough players', () => {
    // In this scenario, bob and sally both show up because they both make it 3 people.
    // But billy & doesn't show up because there aren't 5 players
    const computed = computeComing([{
        userName: "danny",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "bob",
        ...allWeather,
        willComeIfAtLeast: 3
    },{
        userName: "sally",
        ...allWeather,
        willComeIfAtLeast: 3
    },{
        userName: "billy",
        ...allWeather,
        willComeIfAtLeast: 5
    }], 50)
    expect(computed).toEqual({
        "danny": true,
        "bob": true,
        "sally": true,
        "billy": false,
    })
});

test('computeComing works for a big edge case', () => {
    // This scenario looks like 0 0 2 5 7 7 7.
    // Everyone should come. We're verifying that it can figure out the 5 should come.
    const computed = computeComing([{
        userName: "p1",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "p2",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "p3",
        ...allWeather,
        willComeIfAtLeast: 2
    },{
        userName: "p4",
        ...allWeather,
        willComeIfAtLeast: 5
    },{
        userName: "p5",
        ...allWeather,
        willComeIfAtLeast: 7
    },{
        userName: "p6",
        ...allWeather,
        willComeIfAtLeast: 7
    },{
        userName: "p7",
        ...allWeather,
        willComeIfAtLeast: 7
    }], 50)
    expect(computed).toEqual({
        "p1": true,
        "p2": true,
        "p3": true,
        "p4": true,
        "p5": true,
        "p6": true,
        "p7": true,
    })

    // This scenario cuts one player, so only 3 should show up.
    const computed2 = computeComing([{
        userName: "p1",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "p2",
        ...allWeather,
        willComeIfAtLeast: 0
    },{
        userName: "p3",
        ...allWeather,
        willComeIfAtLeast: 2
    },{
        userName: "p4",
        ...allWeather,
        willComeIfAtLeast: 5
    },{
        userName: "p5",
        ...allWeather,
        willComeIfAtLeast: 7
    },{
        userName: "p6",
        ...allWeather,
        willComeIfAtLeast: 7
    }], 50)
    expect(computed2).toEqual({
        "p1": true,
        "p2": true,
        "p3": true,
        "p4": false,
        "p5": false,
        "p6": false,
    })
});

test('computeComing respects bringing extra players', () => {
    const computed = computeComing([{
        userName: "danny",
        weather: 100,
        willBring: 2,
        willComeIfAtLeast: 0
    },{
        userName: "bob",
        ...allWeather,
        willComeIfAtLeast: 3
    },], 50)
    expect(computed).toEqual({
        "danny": true,
        "bob": true,
    })
});