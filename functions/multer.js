import multer from 'multer';
import randomstring from 'randomstring';

const storage = multer.diskStorage({
    destination: 'client/build/prodImg',
    filename: (req, file, cb) => {
        cb(null, randomstring.generate(10) + file.originalname)
    }
});

export default multer({storage});