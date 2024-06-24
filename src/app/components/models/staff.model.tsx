/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";

export function StaffModel(props: GroupProps) {
  const { nodes, materials } = useGLTF("/assets/models/staff-transformed.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Wizard_Staff3_Wizard_Staff3_0 as THREE.Mesh).geometry}
        material={materials.Wizard_Staff3}
        position={[-0.041, 0.983, 0.768]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.04}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={
          (nodes.Wizard_Staff3_Wizard_Staff3_0_1 as THREE.Mesh).geometry
        }
        material={materials.Wizard_Staff3}
        position={[-0.041, 0.983, 0.768]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.04}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={
          (nodes.Wizard_Staff3_Wizard_Staff3_0_2 as THREE.Mesh).geometry
        }
        material={materials.Wizard_Staff3}
        position={[-0.041, 0.983, 0.768]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.04}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={
          (nodes.Wizard_Staff3_Wizard_Staff3_0_3 as THREE.Mesh).geometry
        }
        material={materials.Wizard_Staff3}
        position={[-0.041, 0.983, 0.768]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.04}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Wizard_Staff2_Wizard_Staff2_0 as THREE.Mesh).geometry}
        material={materials.Wizard_Staff2}
        position={[-0.041, 0.983, 0.768]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.04}
      />
    </group>
  );
}

useGLTF.preload("/assets/models/staff-transformed.glb");
