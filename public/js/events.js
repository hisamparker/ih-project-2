const visibleCheckboxes = document.querySelectorAll(`.checky`);
visibleCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener(`change`, () => {
        const hiddenCheckbox = checkbox.nextElementSibling;
        checkbox.checked ? (hiddenCheckbox.value = true) : (hiddenCheckbox.value = false);
    })
);

let easterCounter = 0;

const hisam = document.getElementById(`easter`);
hisam.addEventListener(`click`, () => {
    easterCounter++;
    if (easterCounter === 3) {
        window.location.replace(`/easter`);
    }
});
