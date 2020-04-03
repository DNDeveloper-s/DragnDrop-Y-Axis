const rolesContainer = document.querySelector('.roles_container');

const roleTags = rolesContainer.querySelectorAll('.role_tag');

let prevTagWidth = 0, 
    marginLeft = 10,
    marginTop = 10, 
    verticalLaneCount = 0, 
    containerPadding = 10;

function arrangeByPriority() {
    for(let i = 0; i < roleTags.length; i++) {
        // Current Role Tag
        // const roleTag = rolesContainer.querySelector(`[data-priority="${i + 1}"]`);

        const roleTag = roleTags[i];
    
        // Calculating Left Position
        let calcLeft = prevTagWidth + marginLeft;
    
        // Getting coords of the current role tag
        const roleTagCoords = getCoords(roleTag, rolesContainer);
    
        // Checking for vertical positioning
        if(calcLeft + roleTagCoords.width > roleTagCoords.containerWidth - containerPadding) {
            // Incrementing Veritcal Lane count
            verticalLaneCount++;
            // Resetting prevWidth
            prevTagWidth = 0;
            // Recalculating left position
            calcLeft = prevTagWidth + marginLeft;
        }
    
        // Calculating Top Position
        const calcTop = (roleTagCoords.height + marginTop) * verticalLaneCount;
    
        // Styling for vertical
        roleTag.style.top = `${calcTop}px`;
    
        // Styling for horizontal
        roleTag.style.left = `${calcLeft}px`;
    
        // Storing previous tag width for next tag positioning
        prevTagWidth = roleTagCoords.width + marginLeft + prevTagWidth;
    }
}

arrangeByPriority();

let x = 0, y = 0;

const containerCoords = rolesContainer.getBoundingClientRect();

rolesContainer.addEventListener('mousemove', function(e) {
    x = e.pageX - containerCoords.left;
    y = e.pageY - containerCoords.top + this.scrollTop;
})

window.requestAnimationFrame(function animate() {
    // console.log(x, y);
    window.requestAnimationFrame(animate);
})

roleTags.forEach((roleTag, ind) => {
    roleTag.addEventListener('mousedown', function(e) {
        console.log('dragging', roleTag);
    })

    // roleTag.addEventListener('mouseup', function(e) {
    //     console.log(x, y);
    // })
    // roleTag.addEventListener('dragend', function(e) {
    //     // console.log(x, y);
    // })
    // roleTag.addEventListener('drop', function(e) {
    //     console.log(roleTag);
    //     x = e.pageX - containerCoords.left;
    //     y = e.pageY - containerCoords.top + this.scrollTop;
    //     console.log(x, y);
    //     roleTag
    // })
    roleTag.addEventListener('dragover', function(e) {
        console.log(roleTag);
    })
})

function getCoords (el, container) {
    const elCoords = el.getBoundingClientRect();
    const containerCoords = container.getBoundingClientRect();
    return {
        width: elCoords.width,
        height: elCoords.height,
        top: elCoords.top - containerCoords.top,
        left: elCoords.left - containerCoords.left,
        containerHeight: containerCoords.height,
        containerWidth: containerCoords.width
    }
}