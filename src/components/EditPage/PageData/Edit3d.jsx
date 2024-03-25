import React, { useEffect, useRef, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Color, Vector3 } from 'three';
import { useRecoilState } from 'recoil';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { LodingState } from '../../../store/recoil';

function Model({ objecturl }) {
  const modelRef = useRef();
  const { camera } = useThree();
  const [loadingValue, setLoadingValue] = useRecoilState(LodingState);
  const [loadUrl, setLoadUrl] = useState(objecturl);
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color('#FFFFFF'); // 씬의 배경색을 흰색으로 설정
  }, [scene]);

  useEffect(() => {
    setLoadUrl(objecturl);
    setLoadingValue(true);
  }, [objecturl]);

  // const obj = useLoader(
  //   OBJLoader,
  //   loadUrl || `${process.env.PUBLIC_URL}/3dObject/Camera.obj`,
  // );
  const materials = useLoader(
    MTLLoader,
    `${process.env.PUBLIC_URL}/3dObject/Camera/10124_SLR_Camera_SG_V1_Iteration2.mtl`,
  );
  const object = useLoader(
    OBJLoader,
    loadUrl || `${process.env.PUBLIC_URL}/3dObject/Camera/Camera.obj`,
    (loader) => {
      materials.preload();
      loader.setMaterials(materials);
    },
  );
  useEffect(() => {
    if (object) {
      setLoadingValue(false);
    }
  }, [object]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!modelRef.current) return;
      const speed = 0.5;

      const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

      switch (event.key) {
        case 'w':
          modelRef.current.position.add(forward.multiplyScalar(-speed));
          break;
        case 's':
          modelRef.current.position.add(forward.multiplyScalar(speed));
          break;
        case 'a':
          modelRef.current.position.add(right.multiplyScalar(speed));
          break;
        case 'd':
          modelRef.current.position.add(right.multiplyScalar(-speed));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      if (!modelRef.current) return;
      const speed = 0.5;
      if (event.key === 'Shift') {
        modelRef.current.position.add(new Vector3(0, -speed, 0));
      } else if (event.key === 'Control') {
        modelRef.current.position.add(new Vector3(0, speed, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera, objecturl]);

  return (
    <mesh ref={modelRef} visible={!loadingValue}>
      <primitive object={object} position={[0, 0, -1]} scale={0.03} />
    </mesh>
  );
}

function Edit3d({ objecturl }) {
  const { camera } = useThree();

  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isMouseDown) return;
      const { movementX } = event;
      const rotationSpeed = 0.005;
      camera.rotation.y -= movementX * rotationSpeed;
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [camera, isMouseDown]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <hemisphereLight
        skyColor={0xffffbb}
        groundColor={0x080820}
        intensity={1}
      />
      <directionalLight position={[0, 0, 5]} intensity={5} />
      <directionalLight position={[5, 5, 5]} intensity={5} />
      <directionalLight position={[-5, -5, -5]} intensity={5} />
      <Model objecturl={objecturl} />
    </>
  );
}

export default Edit3d;
