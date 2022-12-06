const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string()
        .required("عنوان پست الزامی میباشد")
        .min(5, "عنوان پست نباید کمتر از ۵ کاراکتر باشد.")
        .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد."),
    body: Yup.string().required("پست باید دارای محتوا باشد"),
    status: Yup.mixed().oneOf(
        ["public", "private"],
        " یکی از دو وضعیت عمومی یا خصوصی را انتخاب کنید"
    ),
    thumbnail: Yup.object().shape({
        name: Yup.string().required("عکس پروفایل الزامی میباشد."),
        size: Yup.number().max(3000000, "عکس نباید بیشتر از ۳ مگابایت باشد."),
        mimetype: Yup.mixed().oneOf(
            ["image/jpeg", "image/png"],
            "تنها پسوند های pngوjpegپشتیبانی میشود."
        ),
    }),
});