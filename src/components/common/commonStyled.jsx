import styled, { keyframes } from "styled-components";
import { AccordionItem } from ".";

export const AccordionItemWrpper = styled.div`
  .accordionBtn {
    .accordionIcn {
      top: 50%;
      transform: translateY(-50%);
      transition: 0.4s;
    }
    &.active {
      .accordionIcn {
        top: 50%;
        // transform: translateY(-50%) rotate(-180deg);
      }
    }
  }
`;
