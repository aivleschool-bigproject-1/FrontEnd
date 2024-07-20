import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useCallback, useRef} from "react";
import axios from "axios";

const Editor = ({onChange, initialValue}) => {
    const quillRef = useRef(null);

    const uploadImage = useCallback(async (file) => {
        const image = new FormData();
        image.append('image', file);

        const response = await axios.post('/s3-upload', image, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // TODO - user header 사용
                'Authorization': 'JWTShield eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJCT0RBIiwiaWQiOjI2LCJleHAiOjE3MjE2Mzk4MTUsInVzZXJuYW1lIjoiYWRtaW4ifQ.mHIGpEpek13RiAE2Ia0-3o0MC0GsdpxSB4Umh5FkNcErTjk-DO1SPFzxGKMQ00rJzEFZZAqtczcGjpIzk3nvuA'
            }
        });

        console.log(response);
        if (response.status !== 200) {
            throw new Error('image upload failed!');
        }
        return response.data;
    }, []);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            console.log('file');
            console.log(file);

            try {
                const imageUrl = await uploadImage(file);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        };
    }, []);

    const handleChange = useCallback((value) => {
        onChange(value);
    }, [onChange]);

    return <ReactQuill
        ref={quillRef}
        value={initialValue}
        placeholder={"content"}
        modules={{
            toolbar: {
                container: [
                    [{header: [1, 2, false]}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        {list: 'ordered'},
                        {list: 'bullet'},
                        {indent: '-1'},
                        {indent: '+1'},
                    ],
                    ['image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }}
        formats={[
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ]}
        onChange={handleChange}
    />
}

export default Editor;