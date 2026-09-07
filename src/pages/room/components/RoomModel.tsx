import pointIcon from '@/assets/toast/coin.png';
import PointReceipt from '@/components/point/PointReceipt';
import { isDemoMode } from '@/demo/demoMode';
import { Center, Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getPointBalance } from '../../../apis/point';
import Furnitures from '../../../components/room-models/Furnitures';
import { RoomLighting } from '../../../components/room-models/RoomLighting';
import { CAMERA_CONFIG } from '../../../constants/sceneSetting';
import { useUserStore } from '../../../store/useUserStore';
import { useRoomItems } from '../hooks/useRoomItems';
import { shouldOpenDemoPointReceipt } from '../pointReceiptBehavior';
import Guestbook from './Guestbook';

const roomModelPromises = new Map<string, Promise<THREE.Group>>();

const loadRoomModel = (modelPath: string) => {
  const cached = roomModelPromises.get(modelPath);
  if (cached) return cached;

  const modelPromise = new GLTFLoader()
    .loadAsync(modelPath)
    .then(({ scene }) => scene);

  roomModelPromises.set(modelPath, modelPromise);
  return modelPromise;
};

function RoomScene({
  modelPath,
  onModelLoaded,
}: {
  modelPath: string;
  onModelLoaded?: () => void;
}) {
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let isCurrentModel = true;

    loadRoomModel(modelPath)
      .then((loadedScene) => {
        if (!isCurrentModel) return;

        const nextScene = loadedScene.clone(true);
        nextScene.position.set(0, 0, 0);
        nextScene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        setScene(nextScene);
        onModelLoaded?.();
      })
      .catch((error) => {
        roomModelPromises.delete(modelPath);
        console.error('방 모델 불러오기 실패:', error);
      });

    return () => {
      isCurrentModel = false;
    };
  }, [modelPath, onModelLoaded]);

  if (!scene) return null;

  return (
    <mesh>
      <Center>
        <primitive
          object={scene}
          scale={0.68}
          rotation={[0, -Math.PI / 4, 0]}
        />
      </Center>
    </mesh>
  );
}

export default function RoomModel({
  modelPath,
  activeSettings,
  ownerName,
  ownerId,
  roomId,
  furnitures,
  onModelLoaded,
}: RoomModelProps) {
  const roomItems = useMemo(
    () => ({ roomId, furnitures }),
    [furnitures, roomId],
  );
  const { items } = useRoomItems(roomItems);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);
  const [isPointReceiptOpen, setIsPointReceiptOpen] = useState(false);
  const [pointBalance, setPointBalance] = useState<number | null>(null);
  const [isPiggyHovered, setIsPiggyHovered] = useState(false);
  const [piggyPosition, setPiggyPosition] = useState<
    [number, number, number] | null
  >(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const fetchPointBalance = async () => {
    try {
      const { balance } = await getPointBalance(ownerId);
      setPointBalance(balance);
    } catch (error) {
      console.error('포인트 잔고 조회 실패:', error);
    }
  };

  const handleInteraction = (itemType: string) => {
    switch (itemType) {
      case 'BOOKSHELF':
        navigate(`/bookcase/${ownerId}`);
        break;
      case 'CD_RACK':
        navigate(`/cdrack/${ownerId}`);
        break;
      case 'GUEST_BOOK':
        setIsGuestBookOpen(true);
        break;
      case 'PIGGY_BANK':
        if (
          shouldOpenDemoPointReceipt(
            isDemoMode,
            ownerId === user?.userId,
          )
        ) {
          void fetchPointBalance().finally(() => setIsPointReceiptOpen(true));
        } else if (ownerId === user?.userId) {
          navigate(`/point/${ownerId}`);
        }
        break;
    }
  };

  const handleHover = (
    itemType: string,
    isHovering: boolean,
    position?: [number, number, number],
  ) => {
    if (itemType === 'PIGGY_BANK') {
      setIsPiggyHovered(isHovering);
      if (isHovering) {
        fetchPointBalance();
        setPiggyPosition(position || [0, 0, 0]);
      } else {
        setPiggyPosition(null);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: activeSettings ? -100 : 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18 }}
        className='relative w-full h-screen'>
        <Canvas
          shadows
          camera={CAMERA_CONFIG}>
          <RoomLighting />
          <directionalLight
            position={[10, 30, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <RoomScene
            modelPath={modelPath}
            onModelLoaded={onModelLoaded}
          />
          {items.map((item) => (
            <Suspense
              key={item.id}
              fallback={null}>
              <Furnitures
                item={item}
                onInteract={handleInteraction}
                onHover={handleHover}
              />
              {/* 잔액 표시 */}
              {item.type === 'PIGGY_BANK' &&
                isPiggyHovered &&
                pointBalance !== null &&
                piggyPosition && (
                  <Html
                    position={[
                      piggyPosition[0] + 1.4,
                      piggyPosition[1] - 0.38,
                      piggyPosition[2],
                    ]}
                    center>
                    <div
                      className={`
                      speech-bubble flex items-center gap-1 justify-center px-8 py-2 rounded-lg
                      bg-white/70 relative 
                      `}>
                      <img
                        src={pointIcon}
                        alt='사용자 현재 포인트'
                        className='w-4 h-4'
                      />
                      <p className='text-[#607AA9] font-semibold 2xl:text-base text-sm'>
                        {pointBalance}P
                      </p>
                    </div>
                  </Html>
                )}
            </Suspense>
          ))}
          <OrbitControls
            enableRotate={false}
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={12}
            mouseButtons={{ LEFT: THREE.MOUSE.PAN }}
            touches={{
              ONE: THREE.TOUCH.PAN,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Canvas>
      </motion.div>
      <AnimatePresence>
        {isGuestBookOpen && (
          <Guestbook
            ownerName={ownerName}
            onClose={() => setIsGuestBookOpen(false)}
            ownerId={ownerId}
          />
        )}
        {isPointReceiptOpen && (
          <PointReceipt
            balance={pointBalance ?? 1720}
            onClose={() => setIsPointReceiptOpen(false)}>
            <div className='w-full min-h-55 flex items-center justify-center border-y-2 border-dashed border-[#B7C7EA]'>
              <p className='text-[#3E507D] text-sm font-medium'>
                포인트 내역이 없어요! (´,,•﹃ •,,｀)
              </p>
            </div>
          </PointReceipt>
        )}
      </AnimatePresence>
    </>
  );
}
