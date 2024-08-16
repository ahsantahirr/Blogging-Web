
import {   auth,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
    signInWithEmailAndPassword,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL, } from "../utils/utils.js";
document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('container');

    const toggle = () => {
        container.classList.toggle('sign-in');
        container.classList.toggle('sign-up');
    };

    setTimeout(() => {
        container.classList.add('sign-in');
    }, 200);
    
    // Attach the toggle function to window so it's available globally
    window.toggle = toggle;
});
const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;
  console.log("email", email);
  console.log("password", password);

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((err) => alert(err));
});
//signup form.
let userImgpreview = document.getElementById("user-image")
let imginput = document.getElementById("imginput")
const imgInput = document.getElementById("imgfile-input");
const userImage = document.getElementById("user-image");
const signup_btn = document.getElementById("signup_form");
const submit_btn = document.getElementById("submit_btn");


signup_btn.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log(e);
    const img = e.target[0].files[0];
    const username = e.target[1].value;
    const email = e.target[2].value;
    const password= e.target[3].value;

    const userInfo ={
        img,
        username,
        email,
        password,
    }
    console.log(userInfo);
    submit_btn.disabled=true;
    submit_btn.value="Loading..."
    createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log("user=>", user.user.uid);
      // upload user image
      const userRef = ref(storage, `user/${user.user.uid}` );
      uploadBytes(userRef, img)
        .then(() => {
          console.log("user image uploaded");
          // getting url of the image we just uploaded
          getDownloadURL(userRef)
            .then((url) => {
              console.log("url agya bhai=>", url);

              // update user info object
              userInfo.img = url;

              // created user document reference
              const userDbRef = doc(db, "users", user.user.uid);

              // set this document to db
              setDoc(userDbRef, userInfo).then(() => {
                console.log("User Object Updated into DB");
                window.location.href = "../index.html";
                submit_btn.disabled = false;
                submit_btn.value = "Submit";
              });
            })
            .catch((err) => {
              console.log("url firebase nahn de raha");
              submit_btn.disabled = false;
              submit_btn.value = "Submit";
            });
        })
        .catch(() => {
          console.log("Error in uploading user image");
          submit_btn.disabled = false;
          submit_btn.value = "Submit";
        });
    })
    .catch((err) => {
      alert(err), (submit_btn.disabled = false);
      submit_btn.value = "Submit";
    });

    
});
imginput.addEventListener("change", () => {
    const file = imginput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userImgpreview.src = e.target.result;
            userImgpreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});