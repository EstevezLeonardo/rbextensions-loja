"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, Float, useGLTF } from "@react-three/drei";

const CAMINHO_MODELO = "/models/royal-brazilian-medalhao.glb";

function Medalhao() {
  const { scene } = useGLTF(CAMINHO_MODELO);
  return <primitive object={scene} />;
}

useGLTF.preload(CAMINHO_MODELO);

/**
 * Ícone 3D flutuante da marca (medalhão dourado) — hero de
 * /consultoria. <Bounds fit> enquadra a câmera automaticamente em
 * volta do modelo, então funciona independente da escala/origem
 * exportadas no .glb. Precisa rodar só no navegador (WebGL) — por
 * isso o componente inteiro é Client Component.
 */
export function IconeMedalhao3D() {
  return (
    <div className="aspect-square w-full">
      <Canvas camera={{ fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.3}>
            <Float speed={1.3} rotationIntensity={0.55} floatIntensity={1.1}>
              <Medalhao />
            </Float>
          </Bounds>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
