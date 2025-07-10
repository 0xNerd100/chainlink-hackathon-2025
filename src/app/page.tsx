"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import Portfolio from "@/app/portfolio/page";
export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  }, []);

  return (
    <>
      <Portfolio />
      {/* <ComingSoon /> */}
      {/* <Footer /> */}
    </>
  );
}

const BtnModal = styled.button`
  @media (max-height: 620px) {
    transform: unset !important;
    top: 111px !important;
    svg {
      max-height: 481px;
    }
  }
`;

const buttonBg = (
  <svg
    className="h-full max-h-[500px] w-auto"
    width={38}
    height={656}
    viewBox="0 0 38 656"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_783_1467)">
      <g filter="url(#filter0_d_783_1467)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.922973 434.181L0.922993 656L31.9999 656L31.9999 422.81L31.9999 414.683L31.9168 232.014L31.9999 221.819L31.9999 68.002L13.7143 68.002L16.4571 64.7717L31.9999 64.7717L31.9999 60.2162L13.7143 60.2162L16.4571 56.9859L31.9999 56.9859L31.9999 52.4304L13.7143 52.4304L16.4571 49.2001L31.9999 49.2001L31.9999 15.3431L16.4568 1.359e-06L0.922935 2.71719e-06L0.922955 221.819L11.1681 232.014L11.2512 423.986L0.922973 434.181Z"
          fill="#26FA0F"
        />
      </g>
      <rect opacity="0.3" x={20} y={501} width={12} height={5} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={507} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={512} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={515} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={518} width={12} height={3} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={526} width={12} height={1} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={528} width={12} height={3} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={535} width={12} height={5} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={522} width={12} height={1} fill="#183D2C" />
      <rect opacity="0.3" x={20} y={532} width={12} height={1} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={161} width={12} height={5} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={167} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={172} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={175} width={12} height={2} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={178} width={12} height={3} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={186} width={12} height={1} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={188} width={12} height={3} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={195} width={12} height={5} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={182} width={12} height={1} fill="#183D2C" />
      <rect opacity="0.3" x={-2} y={192} width={12} height={1} fill="#183D2C" />
      <g filter="url(#filter1_d_783_1467)">
        <path
          d="M6.07329 429.097L0.923023 424.013L0.923006 232.014L6.09173 226.912"
          stroke="#26FA0F"
          strokeWidth={2}
          strokeMiterlimit={10}
        />
      </g>
      <g filter="url(#filter2_d_783_1467)">
        <path
          d="M45 15.8798L58.7304 1H592V637.387L575.747 655H45V15.8798Z"
          stroke="#26FA0F"
          strokeWidth={2}
          shapeRendering="crispEdges"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_783_1467"
        x="-7.07706"
        y={-8}
        width="47.077"
        height={672}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={4} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.14902 0 0 0 0 0.980392 0 0 0 0 0.0588235 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_783_1467"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_783_1467"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_783_1467"
        x="-8.07699"
        y="218.201"
        width="22.8712"
        height="219.608"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={4} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.14902 0 0 0 0 0.980392 0 0 0 0 0.0588235 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_783_1467"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_783_1467"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_783_1467"
        x={36}
        y={-8}
        width={565}
        height={672}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={4} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.14902 0 0 0 0 0.980392 0 0 0 0 0.0588235 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_783_1467"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_783_1467"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_783_1467">
        <rect width={38} height={656} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
