import gsap from "gsap";

const tl = gsap.timeline();





tl.from(".nav h1, .nav .links a, .nav .menu", {
    y: -150,
    duration: 0.6,
    ease: "power4.inOut",
    stagger: 0.3,
   
})
    .from(".text", {
        opacity: 0,
        duration: 1,
        ease: "power4.inOut"
    })
    .from("canvas", {
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power4.inOut"
    }, "<1");




const tl2 = gsap.timeline({ paused: true });
tl2.to(".full", {
    top: 0,
    duration: 1,
    ease: "power4.inOut",
}).from(".full h1", {
    opacity: 0,
    duration: 1,
    ease: "power4.inOut",
}).from(".full .all-links a", {
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power4.inOut"
}).from(".full .close", {
    opacity: 0,
    duration: 1,
    ease: "power4.inOut",
});




const menu = document.querySelector(".menu");
const close = document.querySelector(".close");

menu.addEventListener("click", () => {
    tl2.play();
});
close.addEventListener("click", () => {
    tl2.reverse();
});