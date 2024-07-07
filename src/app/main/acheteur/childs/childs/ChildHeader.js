import React from 'react';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';

function ChildHeader(props) {

    return (
        <div className="flex flex-1 w-full items-center justify-between">

            <div className="flex items-center">

                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="hidden sm:flex" variant="h6">Liste d'essai de s'inscrire</Typography>
                </FuseAnimate>
            </div>


        </div>
    );
}

export default ChildHeader;
