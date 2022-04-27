if (document.querySelector(".register__submit")) {
  document.querySelector(".register__submit").onclick = async (e) => {
    const name = document.querySelector(".register__name").value;
    const studentCode = document.querySelector(".register__studentCode").value;
    const classroom = document.querySelector(".register__class").value;
    const email = document.querySelector(".register__email").value;

    console.log(name, studentCode, classroom, email);

    const user = { name, studentCode, classroom, email };
    console.log(user);
    const res = await fetch("/user/createUserQR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    const { code } = data;
    console.log(code);
    document.querySelector(".container__right-image").src = code;
    document.querySelector(".container__right-image").style.height = "180px";
    document.querySelector(".container__right-image").style.width = "180px";
  };
}
