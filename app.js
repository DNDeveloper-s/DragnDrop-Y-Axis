const container = document.querySelector('.container');
const cursor = container.querySelector('.cursor');

let x = null, y = null;

const config = {
    ui: {
        containerPaddingY: 10,
        itemHeight: 40, 
        itemMarginTop: 0,
    },
    positions: [],
    interactions: {
        itsEnter: false,
        itsDown: false,
        curDownTarget: null,
        curDownItemNo: null,
        curUpTarget: null,
        curUpItemNo: null,
    }
}

// Setting up UI
function arrangeItems() {
    let prevHeight = 0;
    const roleListContainer = container.querySelector('.role_list');
    const roleListItems = container.querySelectorAll('.role_list_item');
    roleListItems.forEach((item, ind) => {
        const calcTop = prevHeight;
        
        // Setting style "top"
        item.style.top = `${calcTop}px`;
        
        config.positions.push({
            top: calcTop,
            bottom: calcTop + config.ui.itemHeight,
            item: item,
            itemNo: item.dataset.count
        })

        prevHeight = calcTop + config.ui.itemHeight + config.ui.itemMarginTop;
    })
    roleListContainer.insertAdjacentHTML('afterend', '<div class="drop_places"></div>');

    for(let i = 0; i < roleListItems.length; i++) {
        container.querySelector('.drop_places').insertAdjacentHTML('beforeend', `<div class="drop_place" data-count="${i+1}"></div>`);
    }

    roleListContainer.style.height = `${(config.ui.containerPaddingY) + (roleListItems.length * (config.ui.itemMarginTop + config.ui.itemHeight))}px`
    return roleListItems;
}

const roleListItems = arrangeItems();

const containerCoords = container.getBoundingClientRect();

container.addEventListener('mousedown', function(e) {
    const spread = cursor.querySelector('.spread');
    if(spread) {
        spread.remove();
    }
    cursor.insertAdjacentHTML('beforeend', `<div class="spread"></div>`);

    if(e.srcElement.classList.contains('place_holder')) {
        config.interactions.itsDown = true;
        config.interactions.curDownTarget = e.target.closest('.role_list_item');
        config.interactions.curDownItemNo = +e.target.closest('.role_list_item').dataset.count;
        config.interactions.curDownTarget.classList.add('itsDown');
    }
})

container.addEventListener('mouseup', function(e) {
    if(e.srcElement.classList.contains('place_holder')) {
        config.interactions.itsDown = false;
        config.interactions.curDownTarget.classList.remove('itsDown');
        removeClassToDropPlace(config.interactions.curDownItemNo);
        if(config.interactions.curUpItemNo) {
            config.interactions.curUpTarget = this.querySelector(`.role_list_item[data-count="${config.interactions.curUpItemNo}"]`);
    
            const pos = getPosition(config.interactions.curUpItemNo);
            config.interactions.curDownTarget.style.top = `${pos}px`;
            
        } else {
            const pos = getPosition(config.interactions.curDownItemNo);
            config.interactions.curDownTarget.style.top = `${pos}px`;
        }
    }
})

container.addEventListener('mousemove', function(e) {
    if(config.interactions.itsEnter) {
        x = e.pageX - containerCoords.left;
        y = e.pageY - containerCoords.top;
    }
    if(e.srcElement.classList.contains('place_holder')) {
        cursor.classList.remove('hide');
        cursor.style.top = `${y - cursor.clientHeight / 2}px`;
        cursor.style.left = `${x - cursor.clientWidth / 2}px`;
    }
});

container.addEventListener('mouseleave', function(e) {
    // cursor.classList.add('hide');
    config.interactions.itsEnter = false;
    if(config.interactions.itsDown) {
        const pos = getPosition(config.interactions.curUpItemNo);
        config.interactions.curDownTarget.style.top = `${pos}px`;
        config.interactions.curDownTarget.classList.remove('itsDown');
        removeClassToDropPlace(config.interactions.curDownItemNo);
        config.interactions = {
            itsEnter: false,
            itsDown: false,
            curDownTarget: null,
            curDownItemNo: null,
            curUpTarget: null,
            curUpItemNo: null,
        }
    }
});

container.addEventListener('mouseenter', function(e) {
    config.interactions.itsEnter = true;
});

window.requestAnimationFrame(function animate() {
    if(config.interactions.itsDown) {
        config.interactions.curDownTarget.style.top = `${y - config.ui.itemHeight / 1.3}px`;

        const arr = config.positions.filter((cur) => {
            if(y > cur.top && y < cur.bottom) {
                return {cur: cur};
            }
        })[0];
        if(arr) {
            config.interactions.curUpItemNo = +arr.itemNo;
            removeClassToDropPlace(config.interactions.curDownItemNo);
            addClassToDropPlace(config.interactions.curUpItemNo);
            moveTo(+arr.itemNo, +config.interactions.curDownItemNo);
        }
        
    }
    window.requestAnimationFrame(animate);
});

function addClassToDropPlace(count) {
    const dropPlace = document.querySelector(`.drop_places > .drop_place[data-count="${count}"]`);
    dropPlace.classList.add('active');
}

function removeClassToDropPlace(count) {
    const dropPlace = document.querySelector(`.drop_places > .drop_place[data-count="${count}"]`);
    dropPlace.classList.remove('active');
}

function moveTo(start, end) {
    if(start < end) {
        let prevHeight = start * (config.ui.itemMarginTop + config.ui.itemHeight);

        const item = container.querySelector(`.role_list_item[data-count="${start}"]`);
        config.interactions.curDownTarget.dataset.count = start;
        config.interactions.curDownItemNo = start;
        const calcTop = prevHeight;
        if(item !== config.interactions.curDownTarget) {
            item.style.top = `${calcTop}px`;
            item.dataset.count = start+1;
        }
        prevHeight = calcTop + config.ui.itemMarginTop + config.ui.itemHeight;

    } else if(start > end) {
        let prevHeight = getPosition(start - 1);

        const item = container.querySelector(`.role_list_item[data-count="${start}"]`);

        config.interactions.curDownTarget.dataset.count = start;
        config.interactions.curDownItemNo = start;
        const calcTop = prevHeight;
        if(item !== config.interactions.curDownTarget) {
            item.style.top = `${calcTop}px`;
            item.dataset.count = start-1;
        }
        prevHeight = calcTop - (config.ui.itemMarginTop + config.ui.itemHeight);
    }
}

function getPosition(count) {
    const ind = count - 1;
    return ind * (config.ui.itemHeight + config.ui.itemMarginTop); 
}