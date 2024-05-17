import React, { useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import CancelBtn from './atom/CancelBtn';
import { SearchModalState } from '../../store/modalState';
import useObject from '../../hooks/AddItem/useObject';
import { ReactComponent as Add } from '../../assets/svgIcon/Add.svg';

function updateGltfReferences(gltfContent, urls, textures) {
  const gltfJson = JSON.parse(gltfContent);

  if (gltfJson.buffers) {
    gltfJson.buffers.forEach((buffer) => {
      if (buffer.uri && urls.bin) {
        buffer.uri = urls.bin;
      }
    });
  }

  if (gltfJson.images) {
    gltfJson.images.forEach((image) => {
      const imageName = image.uri.split('/').pop();
      if (textures[imageName]) {
        image.uri = textures[imageName];
      }
    });
  }

  const updatedGltfContent = JSON.stringify(gltfJson);
  const gltfBlob = new Blob([updatedGltfContent], { type: 'model/gltf+json' });
  return URL.createObjectURL(gltfBlob);
}

function SearchObjectModal() {
  const [modalValue, setModalValue] = useRecoilState(SearchModalState);
  const { addObject } = useObject();
  const fileInputRef = useRef(null);

  if (!modalValue) {
    return null;
  }

  const handleFileChange = async (event) => {
    const { files } = event.target;
    if (!files) {
      return;
    }

    const filesData = {
      obj: null,
      mtl: null,
      bin: null,
      gltf: null,
      type: null,
      urls: {},
      textures: {},
    };

    const tempTextureFiles = [];

    const fileReadPromises = Array.from(files).map((file) => {
      const fileName = file.name;
      const extension = fileName.split('.').pop().toLowerCase();
      return new Promise((resolve, reject) => {
        if (
          extension === 'obj' ||
          extension === 'mtl' ||
          extension === 'bin' ||
          extension === 'gltf'
        ) {
          if (extension === 'obj' || extension === 'gltf') {
            filesData.type = extension;
          }
          const blobUrl = URL.createObjectURL(file);
          filesData.urls[extension] = blobUrl;
          filesData[extension] = blobUrl;

          if (extension === 'gltf') {
            const reader = new FileReader();
            reader.onload = (e) => {
              filesData.gltfContent = e.target.result;
              resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
          } else {
            resolve();
          }
        } else if (['jpeg', 'jpg', 'png'].includes(extension)) {
          tempTextureFiles.push(file);
          resolve();
        } else {
          resolve();
        }
      });
    });

    await Promise.all(fileReadPromises);

    tempTextureFiles.forEach((file) => {
      const blobUrl = URL.createObjectURL(file);
      filesData.textures[file.name] = blobUrl;
    });

    if (filesData.gltfContent) {
      const updatedGltfBlobUrl = updateGltfReferences(
        filesData.gltfContent,
        filesData.urls,
        filesData.textures,
      );
      filesData.urls.gltf = updatedGltfBlobUrl;
    }

    addObject(
      filesData.obj,
      filesData.mtl,
      filesData.bin,
      filesData.urls.gltf,
      filesData.type,
      filesData.urls,
    );
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const CancelHandler = () => {
    setModalValue(false);
  };

  return (
    <ModalBackdrop>
      <ModalBox>
        <CancelPostion>
          <CancelBtn CancelHandler={CancelHandler} />
        </CancelPostion>
        <ContentContainer>
          <HiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
            accept=".gltf,.bin,.obj,.mtl,.jpeg,.jpg,.png"
            ref={fileInputRef}
          />
          <Button onClick={handleButtonClick}>
            <PlusIcon>
              <Add width="3.3333333333333335vw" height="5.9259259259259265vh" />
            </PlusIcon>
            <ButtonText>내 3D 모델 넣기</ButtonText>
          </Button>
        </ContentContainer>
      </ModalBox>
    </ModalBackdrop>
  );
}

export default SearchObjectModal;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48.125vw;
  height: 57.96296296296296vh;
  background-color: #ffffff;
  border-radius: 12px;
`;

const CancelPostion = styled.div`
  position: absolute;
  top: 1vw;
  right: 1vw;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Button = styled.button`
  position: absolute;
  top: 2vw;
  left: 3vw;
  display: flex;
  align-items: center;
  padding: 1vw;
  border: none;
  background-color: #ffffff;
  cursor: pointer;
`;

const PlusIcon = styled.span`
  margin-right: 1vw;
`;

const ButtonText = styled.span`
  font-size: 1.4vw;
`;