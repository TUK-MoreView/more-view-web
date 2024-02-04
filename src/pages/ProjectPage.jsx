import styled from 'styled-components';
import { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { useRecoilState, useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';

import { interactiveState, pageState, shapeList } from '../store/recoil';

import ProjectHeaer from '../components/ProjectPage/ProjectHeader';
import ProjectItem from '../components/ProjectPage/ProjectItem';
import ProjectKonva from '../components/ProjectPage/ProjectKonva';
import DesignInteractive from '../components/ProjectPage/ItemComponents/DesignInteractive';
import ElementInteractive from '../components/ProjectPage/ItemComponents/ElementInteractive';
import TextInteractive from '../components/ProjectPage/ItemComponents/TextInteractive';
import ProjectSlide from '../components/ProjectPage/ProjectSlide';
import Project3d from '../components/ProjectPage/Project3d';
import EditableText from '../components/ProjectPage/EditableText';

function ProjectPage() {
  const [selectedId, selectShape] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [textValue, setTextValue] = useState('Some initial text');

  const pageRendering = useRecoilValue(pageState);
  const [shapeValue, setShapeValue] = useRecoilState(shapeList);
  const [menu, setMenu] = useRecoilState(interactiveState);

  const handleTextChange = (newText) => {
    setTextValue(newText);
  };

  const handleClose = () => {
    setMenu(0);
  };
  const toggleSlide = () => {
    setIsOpen(!isOpen);
  };
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };
  const handleDragEnd = (shapeId, newAttrs) => {
    // 현재 페이지의 도형 배열을 복사하여 업데이트
    const currentPageShapes = shapeValue[pageRendering]
      ? [...shapeValue[pageRendering]]
      : [];
    const updatedShapes = currentPageShapes.map((shape) => {
      if (shape.id === shapeId) {
        return { ...shape, ...newAttrs };
      }
      return shape;
    });

    setShapeValue({ ...shapeValue, [pageRendering]: updatedShapes });
  };
  return (
    <ProjectContainer>
      <ProjectHeaer />
      <div
        style={{
          display: 'flex',
        }}
      >
        <ProjectItem />
        <motion.div
          key={menu}
          initial={{ x: '-2vw', opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' },
          }}
          style={{
            zIndex: 1,
          }}
        >
          {menu === 1 && <DesignInteractive onClose={handleClose} />}
          {menu === 2 && <ElementInteractive onClose={handleClose} />}
          {menu === 3 && <TextInteractive onClose={handleClose} />}
        </motion.div>
        <CanvasContainer>
          <h1>{pageRendering + 1} 페이지</h1>
          {pageRendering === 0 && (
            <Stage
              width={1200}
              height={600}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
            >
              <Layer>
                <Rect x={0} y={0} width={1200} height={600} fill="#D9D9D9" />
                <EditableText
                  initialText={textValue}
                  onTextChange={handleTextChange}
                />
                {shapeValue[pageRendering]?.map((shape) => {
                  if (shape.type === 'Rectangle') {
                    return (
                      <ProjectKonva
                        key={shape.id}
                        shapeProps={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={() => selectShape(shape.id)}
                        onChange={(newAttrs) =>
                          handleDragEnd(shape.id, newAttrs)
                        }
                      />
                    );
                  }
                  if (shape.type === 'Circle') {
                    return (
                      <Circle
                        key={shape.id}
                        {...shape}
                        onClick={() => selectShape(shape.id)}
                        draggable
                        onDragEnd={(e) =>
                          handleDragEnd(shape.id, e.target.attrs)
                        }
                      />
                    );
                  }
                  if (shape.type === 'Triangle') {
                    return (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        fill={shape.fill}
                        closed
                        onClick={() => selectShape(shape.id)}
                        draggable
                        onDragEnd={(e) =>
                          handleDragEnd(shape.id, {
                            x: e.target.x(),
                            y: e.target.y(),
                          })
                        }
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          )}
          {pageRendering === 1 && (
            <Stage
              width={1200}
              height={600}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
            >
              <Layer>
                <Rect x={0} y={0} width={1200} height={600} fill="#D9D9D9" />
                {shapeValue[pageRendering]?.map((shape) => {
                  if (shape.type === 'Rectangle') {
                    return (
                      <ProjectKonva
                        key={shape.id}
                        shapeProps={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={() => selectShape(shape.id)}
                        onChange={(newAttrs) =>
                          handleDragEnd(shape.id, newAttrs)
                        }
                      />
                    );
                  }
                  if (shape.type === 'Circle') {
                    return (
                      <Circle
                        key={shape.id}
                        {...shape}
                        onClick={() => selectShape(shape.id)}
                        draggable
                        onDragEnd={(e) =>
                          handleDragEnd(shape.id, e.target.attrs)
                        }
                      />
                    );
                  }
                  if (shape.type === 'Triangle') {
                    return (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        fill={shape.fill}
                        closed
                        onClick={() => selectShape(shape.id)}
                        draggable
                        onDragEnd={(e) =>
                          handleDragEnd(shape.id, {
                            x: e.target.x(),
                            y: e.target.y(),
                          })
                        }
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
            </Stage>
          )}
          {pageRendering === 2 && (
            <Canvas
              style={{
                backgroundColor: '#D9D9D9',
                width: '1200px',
                height: '600px',
              }}
            >
              <Project3d />
            </Canvas>
          )}
        </CanvasContainer>
      </div>

      <SlideListPosition>
        <motion.div
          animate={{
            y: isOpen ? 0 : '23.8vh', // isOpen에 따라 Y 위치 변경
          }}
          transition={{ duration: 0.5 }} // 애니메이션 지속 시간
          initial="hidden"
        >
          <ProjectSlide slideOpen={toggleSlide} />
        </motion.div>
      </SlideListPosition>
    </ProjectContainer>
  );
}

export default ProjectPage;

const ProjectContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;
const CanvasContainer = styled.div`
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
`;
const SlideListPosition = styled.div`
  position: absolute;
  left: 5.6vw;
  bottom: 0;
  overflow: hidden;
`;
