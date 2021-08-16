
function touch(dir){
    if (!ispaused && isgamestarted) {
        if (dir === 1) {
            if (curdir.y !== -1) {
                curdir = {
                    x: 0,
                    y: 1
                }
                document.getElementById('0').style.transform = 'rotate(90deg)';
            }
        }
        else if (dir === 0) {
            if (curdir.y !== 1) {
                curdir = {
                    x: 0,
                    y: -1
                }
                document.getElementById('0').style.transform = 'rotate(-90deg)';
            }
        }
        else if (dir === 3) {
            if (curdir.x !== -1) {
                curdir = {
                    x: 1,
                    y: 0
                }
                document.getElementById('0').style.transform = 'rotate(0deg)';
            }
        }
        else if (dir === 2) {
            if (curdir.x !== 1) {
                curdir = {
                    x: -1,
                    y: 0
                }
                document.getElementById('0').style.transform = 'rotate(180deg)';
            }
        }
    }
}