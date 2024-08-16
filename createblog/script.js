import {
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    db,
    collection,
    addDoc,
    auth
} from "../utils/utils.js"


const blog_form = document.getElementById("createblog_form")
blog_form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const bloginfo =
    {
        banner: e.target[0].files[0],
        title: e.target[1].value,
        description: e.target[2].value,
        date: formattedDate,
        createdByemail: auth.currentUser.email,
        createdBy: auth.currentUser.uid,
    }
    console.log(bloginfo.createdByemail);
    const imgref = ref(storage, bloginfo.banner.name)
    uploadBytes(imgref, bloginfo.banner).then(() => {
        console.log("img uploaded");
        getDownloadURL(imgref).then((url) => {
            console.log("url", url);
            bloginfo.banner = url;
            const blogsCollection = collection(db, "blogs")
            addDoc(blogsCollection, bloginfo).then(() => {
                console.log("document Added");
                window.location.href = "../index.html"
            })
        })
    })
})