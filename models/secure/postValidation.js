const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string()
        .required("عنوان پست الزامی میباشد")
        .min(5, "عنوان پست نباید کمتر از ۵ کاراکتر باشد.")
        .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد."),
    body: Yup.string().required("پست باید دارای محتوا باشد"),
    status: Yup.mixed().oneOf(
        ["عمومی", "خصوصی"],
        " یکی از دو وضعیت عمومی یا خصوصی را انتخاب کنید"
    ),
});