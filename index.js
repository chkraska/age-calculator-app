const dayInputElement = document.getElementById("input_day");
const monthInputElement = document.getElementById("input_month");
const yearInputElement = document.getElementById("input_year");
const btn = document.querySelector(".button_sub");

const yearResult = document.querySelector(".result_years");
const monthResult = document.querySelector(".result_months");
const dayResult = document.querySelector(".result_days");

const currentDateObj = new Date();
const dayDate = currentDateObj.getDay();
const monthDate = currentDateObj.getMonth();
const yearDate = currentDateObj.getFullYear();

// Get the total number of days in a specific month
function getTotalDays(month, year) {
  return new Date(year, month, 0).getDate();
}

//Check the validity of each input, setting the error state and error message depends on each situation
function checkDay(dayInput, monthInput, yearInput) {
  if (dayInput.trim() === "") {
    setErrorState(false, dayInputElement);
    setErrorMessage(dayInputElement, "This field is required");
    return false;
  } else if (dayInput.trim() !== "" && dayInput > 31) {
    setErrorState(false, dayInputElement);
    setErrorMessage(dayInputElement, "Must be a valid day");
    return false;
  } else {
    if (checkMonth(monthInput) && checkYear(yearInput)) {
      const totalDaysInMonth = getTotalDays(monthInput, yearInput);
      if (dayInput > totalDaysInMonth) {
        setErrorState(false, dayInputElement);
        setErrorMessage(dayInputElement, "Must be a valid day");
        return false;
      } else {
        setErrorState(true, dayInputElement);
        return true;
      }
    }
    if (!checkMonth(monthInput) || !checkYear(yearInput)) {
      setErrorState(true, dayInputElement);
      return true;
    }
  }
}

function checkMonth(input) {
  if (input.trim() === "") {
    setErrorState(false, monthInputElement);
    setErrorMessage(monthInputElement, "This field is required");
    return false;
  } else if ((input.trim() !== "") & (input < 1 || input > 12)) {
    setErrorState(false, monthInputElement);
    setErrorMessage(monthInputElement, "Must be a valid month");
    return false;
  } else {
    setErrorState(true, monthInputElement);
    return true;
  }
}

function checkYear(input) {
  if (input.trim() === "") {
    setErrorState(false, yearInputElement);
    setErrorMessage(yearInputElement, "This field is required");
    return false;
  } else if ((input.trim() !== "") & (input > yearDate)) {
    setErrorState(false, yearInputElement);
    setErrorMessage(yearInputElement, "Must be in the past");
    return false;
  } else {
    setErrorState(true, yearInputElement);
    return true;
  }
}

// Setting the error state of each input depends on the validity
function setErrorState(inputIsValid, inputElement) {
  inputWrapperElement = inputElement.parentElement;
  if (!inputIsValid) {
    inputWrapperElement.classList.add("input_wrapper_error");
  } else {
    inputWrapperElement.classList.remove("input_wrapper_error");
  }
}

//Setting the error message for each input
function setErrorMessage(inputElement, message) {
  const errorMessageElement = inputElement.nextElementSibling;
  errorMessageElement.textContent = message;
}

//Animate the change of numbers in result section
function animateResult(ele, result) {
  if (result === 0) {
    ele.textContent = result;
  } else {
    let counter = 0;
    const countdown = setInterval(() => {
      counter++;
      ele.textContent = counter;
      if (counter === result) {
        clearInterval(countdown);
      }
    }, 20);
  }
}

// prevent special character [. , e]
[dayInputElement, monthInputElement, yearInputElement].map((ele) =>
  ele.addEventListener("keydown", (event) => {
    const codes = ["KeyE", "Period", "Minus"];
    if (codes.includes(event.code)) {
      event.preventDefault();
      return;
    }
  })
);

function submitHandler(event) {
  event.preventDefault();
  const dayInput = dayInputElement.value;
  const monthInput = monthInputElement.value;
  const yearInput = yearInputElement.value;

  let formIsValid;

  [dayInputElement, monthInputElement, yearInputElement].map((ele) => {
    if (ele === monthInputElement) {
      checkMonth(monthInput);
    } else if (ele === yearInputElement) {
      checkYear(yearInput);
    } else if (ele === dayInputElement) {
      checkDay(dayInput, monthInput, yearInput);
    }
  });

  formIsValid =
    checkDay(dayInput, monthInput, yearInput) &&
    checkMonth(monthInput) &&
    checkYear(yearInput);

  if (formIsValid) {
    const dobObj = new Date(yearInput, monthInput - 1, dayInput);

    if (currentDateObj < dobObj) {
      setErrorState(false, yearInputElement);
      setErrorMessage(yearInputElement, "Must be in the past");
      return;
    }

    let year = currentDateObj.getFullYear() - dobObj.getFullYear();
    let month = currentDateObj.getMonth() - dobObj.getMonth();
    let day = currentDateObj.getDate() - dobObj.getDate();

    if (day < 0) {
      month--;
      day += new Date(
        currentDateObj.getFullYear(),
        currentDateObj.getMonth(),
        0
      ).getDate();
    }

    if (month < 0) {
      year--;
      month += 12;
    }
    animateResult(dayResult, day);
    animateResult(monthResult, month);
    animateResult(yearResult, year);
  }
}

btn.addEventListener("click", submitHandler);
