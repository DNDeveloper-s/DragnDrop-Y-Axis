const container = document.querySelector('.container');
const placeHolder = container.querySelectorAll('.place_holder');

let x = null, y = null;

const config = {
    ui: {
        containerPadding: 10,
        itemHeight: 40, 
        itemMarginTop: 10,
    },
    positions: [],
    interactions: {
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
    const roleListItems = container.querySelectorAll('.role_list_item');
    roleListItems.forEach((item, ind) => {
        const calcTop = prevHeight + config.ui.itemMarginTop;
        
        // Setting style "top"
        item.style.top = `${calcTop}px`;
        
        config.positions.push({
            top: calcTop,
            bottom: calcTop + config.ui.itemHeight,
            item: item,
            itemNo: item.dataset.count
        })

        prevHeight = calcTop + config.ui.itemHeight;
    })
    roleListItems[0].parentElement.style.height = `${config.ui.containerPadding + (roleListItems.length * (config.ui.itemMarginTop + config.ui.itemHeight))}px`
    return roleListItems;
}

const roleListItems = arrangeItems();

const containerCoords = container.getBoundingClientRect();

container.addEventListener('mousedown', function(e) {
    if(e.srcElement.classList.contains('place_holder')) {
        config.interactions.itsDown = true;
        config.interactions.curDownTarget = e.target.closest('.role_list_item');
        config.interactions.curDownItemNo = +e.target.closest('.role_list_item').dataset.count;
        config.interactions.curDownTarget.style.transition = 'none';
    }
})

container.addEventListener('mouseup', function(e) {
    config.interactions.itsDown = false;
    config.interactions.curDownTarget.style.transition = 'all .3s ease-in-out';
    // console.log(e.target);
    if(config.interactions.curUpItemNo) {
        config.interactions.curUpTarget = this.querySelector(`.role_list_item[data-count="${config.interactions.curUpItemNo}"]`);

        const pos = getPosition(config.interactions.curUpItemNo);
        config.interactions.curDownTarget.style.top = `${pos}px`;
        
    } else {
        const pos = getPosition(config.interactions.curDownItemNo);
        config.interactions.curDownTarget.style.top = `${pos}px`;
    }
})

container.addEventListener('mousemove', function(e) {
    x = e.pageX - containerCoords.left;
    y = e.pageY - containerCoords.top;
})

window.requestAnimationFrame(function animate() {
    if(config.interactions.itsDown) {
        config.interactions.curDownTarget.style.top = `${y - config.ui.itemHeight / 2}px`;

        const arr = config.positions.filter((cur) => {
            if(y > cur.top && y < cur.bottom) {
                return {cur: cur};
            }
        })[0];
        // console.clear();
        if(arr) {
            config.interactions.curUpItemNo = +arr.itemNo;
            moveTo(+arr.itemNo, +config.interactions.curDownItemNo);
        }
        
    }

    // console.log(x, y);
    window.requestAnimationFrame(animate);
});

function moveTo(start, end) {
    console.log(start,end);
    if(start < end) {
        let prevHeight = start * (config.ui.itemMarginTop + config.ui.itemHeight) + config.ui.containerPadding;

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
    return ind * (config.ui.itemHeight + config.ui.itemMarginTop) + config.ui.containerPadding; 
}