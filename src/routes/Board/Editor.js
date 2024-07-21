import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCallback, useRef } from 'react';
import axios from 'axios';
import './Editor.css'; // Ensure you import the custom CSS

const Editor = ({ onChange, initialValue }) => {
    const quillRef = useRef(null);

    const uploadImage = useCallback(async (file) => {
        const image = new FormData();
        image.append('image', file);

        const response = await axios.post('/s3-upload', image, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem("Authorization")
            }
        });

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

            try {
                const imageUrl = await uploadImage(file);
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);

                // Add custom class to the inserted image
                const editor = quill.root;
                const img = editor.querySelector(`img[src="${imageUrl}"]`);
                if (img) {
                    img.classList.add('quill-editor');
                }
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        };
    }, [uploadImage]);

    const handleChange = useCallback((value) => {
        onChange(value);
    }, [onChange]);

    return (
        <ReactQuill
            ref={quillRef}
            value={initialValue}
            placeholder={"content"}
            modules={{
                toolbar: {
                    container: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            { indent: '-1' },
                            { indent: '+1' },
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
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote',
                'list',
                'bullet',
                'indent',
                'link',
                'image',
            ]}
            onChange={handleChange}
        />
    );
}

export default Editor;
