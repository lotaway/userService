const fetchItem = id => {
    return new Promise((resolve, reject) => {
        resolve({
            title: "some item"
        });
    });
};

export {fetchItem};