'use client';

import styled from 'styled-components';

const StyledPage = styled.div`
  text-align: center;

  .container {
    height: 100vh;
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;
  }

  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    padding: 1rem;
    max-width: 720px;
  }

  .learn-more {
    position: absolute;
    bottom: 1rem;
    button {
      margin: 0;
      padding: 1rem 2rem;
    }
  }

  #welcome {
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1rem;
      color: #333;
      margin-bottom: 1rem;
    }
    @media only screen and (max-width: 822px) {
      h1 {
        font-size: 2rem;
      }
      p {
        font-size: 0.8rem;
        color: #333;
        margin-bottom: 0.5rem;
      }
    }
  }
`;

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <StyledPage>
      <div className="wrapper">
        <div className="container">
          <div id="welcome" className="vertical-center">
            <h1>DOING GODS WORK</h1>
            <p>
              Through the collective efforts of artist communities, we will fund
              and nurture a vibrant, supportive environment where creativity
              thrives and meaningful connections are forged.
            </p>
            <p>
              Artist hands are provided select paint materials in addition to a
              primed canvas for the work.
            </p>
          </div>
          {/* <div className="learn-more">
            <a href="/apply">
              <button>APPLY</button>
            </a>
          </div> */}
        </div>
      </div>
    </StyledPage>
  );
}
