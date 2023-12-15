import React from 'react';
import icon from '../img/icons/notepad_file-2.png';
import computerIcon from '../img/icons/computer_explorer-4.png';
import briefcaseIcon from '../img/icons/briefcase-3.png';
import recycleIcon from '../img/icons/recycle_bin_empty_cool-0.png';
import searchIcon from '../img/icons/msie1-5.png';

function Desktop() {
    return (
        <>
            <div class="box-desktop">
                    <button class="icons-desktop">
                        <img src={computerIcon} width="50" height="50" class="title" />
                        <p>My Computer</p>
                    </button>
                    <button class="icons-desktop">
                        <img src={recycleIcon} width="50" height="50" class="title" />
                        <p>Recycle Bin</p>
                    </button>
                    <button class="icons-desktop">
                        <img src={searchIcon} width="50" height="50" class="title" />
                        <p >Internet Explore</p>
                    </button>
                    <button class="icons-desktop">
                        <img src={briefcaseIcon} width="50" height="50" class="title" />
                        <p >My Briefcase</p>
                    </button>
            </div>
        </>
    );
}

export default Desktop;

