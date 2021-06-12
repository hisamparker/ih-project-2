// const hasChangeTableCheckbox = document.getElementById(`hasChangeTable`);
// const hiddenHasChangeTableCheckbox = document.getElementById(`hiddenHasChangeTable`);
// hasChangeTableCheckbox.addEventListener(`change`, () => {
//     console.log(hasChangeTableCheckbox.checked);
//     if ((`hasChangeTableCheckbox`, hasChangeTableCheckbox.checked)) {
//         hiddenHasChangeTableCheckbox.value = `Yes`;
//     } else {
//         hiddenHasChangeTableCheckbox.value = `No`;
//     }
//     console.log(hiddenHasChangeTableCheckbox.value);
// });
// const hasPublicToiletCheckbox = document.getElementById(`hasPublicToilet`);
// const hiddenHasPublicToiletCheckbox = document.getElementById(`hiddenHasPublicToilet`);
// hasPublicToiletCheckbox.addEventListener(`change`, () => {
//     console.log(hasPublicToiletCheckbox.checked);
//     if (hasPublicToiletCheckbox.checked) {
//         hiddenHasPublicToiletCheckbox.value = `Yes`;
//     } else {
//         hiddenHasPublicToiletCheckbox.value = `No`;
//     }
//     console.log(hiddenHasPublicToiletCheckbox.value);
// });
// const hasHighChairsCheckbox = document.getElementById(`hasHighChairs`);
// const hiddenHasHighChairsCheckbox = document.getElementById(`hiddenHasHighChairs`);
// hasHighChairsCheckbox.addEventListener(`change`, () => {
//     console.log(hasHighChairsCheckbox.checked);
//     if (hasHighChairsCheckbox.checked) {
//         hiddenHasHighChairsCheckbox.value = `Yes`;
//     } else {
//         hiddenHasHighChairsCheckbox.value = `No`;
//     }
//     console.log(hiddenHasHighChairsCheckbox.value);
// });
// const hasKidsMenuCheckbox = document.getElementById(`hasKidsMenu`);
// const hiddenHasKidsMenuCheckbox = document.getElementById(`hiddenHasKidsMenu`);
// hasKidsMenuCheckbox.addEventListener(`change`, () => {
//     console.log(hasKidsMenuCheckbox.checked);
//     if (hasKidsMenuCheckbox.checked) {
//         hiddenHasKidsMenuCheckbox.value = `Yes`;
//     } else {
//         hiddenHasKidsMenuCheckbox.value = `No`;
//     }
//     console.log(hiddenHasKidsMenuCheckbox.value);
// });
// const hasBabyccinosCheckbox = document.getElementById(`hasBabyccinos`);
// const hiddenHasBabyccinosCheckbox = document.getElementById(`hiddenHasBabyccinos`);
// hasBabyccinosCheckbox.addEventListener(`change`, () => {
//     console.log(hasBabyccinosCheckbox.checked);
//     if (hasBabyccinosCheckbox.checked) {
//         hiddenHasBabyccinosCheckbox.value = `Yes`;
//     } else {
//         hiddenHasBabyccinosCheckbox.value = `No`;
//     }
//     console.log(hiddenHasBabyccinosCheckbox.value);
// });
// const hasToysCheckbox = document.getElementById(`hasToys`);
// const hiddenHasToysCheckbox = document.getElementById(`hiddenHasToys`);
// hasToysCheckbox.addEventListener(`change`, () => {
//     console.log(hasToysCheckbox.checked);
//     if (hasToysCheckbox.checked) {
//         hiddenHasToysCheckbox.value = `Yes`;
//     } else {
//         hiddenHasToysCheckbox.value = `No`;
//     }
//     console.log(hiddenHasToysCheckbox.value);
// });

const visibleCheckboxes = document.querySelectorAll(`.checky`);
visibleCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener(`change`, () => {
        const hiddenCheckbox = checkbox.nextElementSibling;
        checkbox.checked ? (hiddenCheckbox.value = `Yes`) : (hiddenCheckbox.value = `No`);
    })
);
