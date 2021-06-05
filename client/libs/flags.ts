import React from "react";

interface styles {
    [key: string]: React.CSSProperties
}

export const FlagsStyle: styles = {
    love: {
        backgroundColor: "#F94078",
        color: "black"
    },

    angry: {
        backgroundColor: "#E85050",
        color: "black"
    },

    joke: {
        backgroundColor: "#596BAB",
        color: "black",
    },

    sad: {
        backgroundColor: "#70888D",
        color: "black",
    },


}