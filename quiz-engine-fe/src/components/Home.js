import { Button, Card, Divider, Input, notification } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const navi = useNavigate();

  const onQuizChange = (event) => {
    setInputValue(event.target.value);
  };

  const navigate = () => {
    if (inputValue.length) {
      navi(`/quiz/${inputValue}`);
    } else {
      notification.open({
        type: "error",
        message: "Input a Value",
      });
    }
  };

  return (
    <div className="align-items-center d-flex justify-content-evenly h-100 flex-sm-row flex-column">
      <svg
        width="315"
        height="348"
        viewBox="0 0 315 348"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_6302_2)">
          <path
            d="M188.904 20.0508H84.4977C77.739 20.0508 71.5742 21.2119 66.0032 23.5059C60.404 25.8281 55.2289 29.3398 50.5063 34.0977L50.5346 34.126C48.6116 36.0518 46.9149 38.0342 45.3878 40.0732C36.8476 40.4131 28.6466 41.6875 20.7568 43.8965C20.983 43.2734 21.2375 42.6504 21.4921 42.0557C24.8573 33.8994 29.8061 26.5361 36.3951 19.9658L36.4234 19.9941L36.4517 19.9658C43.0407 13.3672 50.3932 8.41113 58.481 5.06934C66.5123 1.6709 75.1939 0 84.4977 0H131.809H236.215C245.49 0 254.2 1.6709 262.316 5.01269C270.461 8.38281 277.813 13.3389 284.374 19.9092L284.346 19.9375C290.963 26.5645 295.912 33.9277 299.249 41.999C302.586 50.1269 304.254 58.8213 304.254 68.1387V68.3935H284.232V68.1387C284.232 61.3701 283.073 55.1963 280.782 49.6172C278.464 44.0098 274.957 38.8271 270.234 34.0977L270.206 34.0693L270.178 34.0977C265.399 29.3115 260.252 25.7998 254.681 23.5059C249.11 21.2119 242.917 20.0508 236.186 20.0508H188.904V20.0508ZM247.611 113.111H312.851V128.942L277.304 165.136H315V183.601H244.896V166.07L278.746 131.604H247.611V113.111ZM206.38 86.3769H233.358V104.7H206.38V86.3769V86.3769ZM206.38 113.111H233.358V183.601H206.38V113.111V113.111ZM189.017 183.601H163.82V172.244C160.059 176.917 156.298 180.259 152.509 182.241C148.691 184.224 144.025 185.215 138.454 185.215C131.045 185.215 125.248 183.006 121.034 178.531C116.821 174.085 114.728 167.231 114.728 157.971V113.111H141.848V151.938C141.848 156.356 142.668 159.5 144.28 161.369C145.92 163.238 148.182 164.145 151.123 164.145C154.319 164.145 156.92 162.898 158.985 160.435C161.021 157.942 162.039 153.496 162.039 147.067V113.083H189.017V183.601ZM90.0404 169.327C93.7732 171.933 96.2052 173.575 97.3647 174.227C99.0614 175.189 101.38 176.322 104.293 177.625L96.0073 194.447C91.822 192.408 87.665 190.001 83.5645 187.197C79.464 184.394 76.5796 182.27 74.9677 180.882C68.3504 183.742 60.0646 185.215 50.0539 185.215C35.2922 185.215 23.6695 181.363 15.1293 173.66C5.03367 164.598 0 151.797 0 135.314C0 119.313 4.41153 106.881 13.2346 98.0166C22.0576 89.1523 34.3307 84.7344 50.167 84.7344C66.286 84.7344 78.7005 89.0674 87.467 97.7334C96.2335 106.371 100.617 118.775 100.617 134.89C100.617 149.248 97.0819 160.718 90.0404 169.327ZM67.0496 153.921C69.4533 149.645 70.641 143.244 70.641 134.691C70.641 124.893 68.8029 117.897 65.1831 113.678C61.5351 109.486 56.5015 107.391 50.0821 107.391C44.087 107.391 39.2513 109.543 35.5467 113.819C31.8139 118.096 29.9758 124.808 29.9758 133.898C29.9758 144.519 31.7856 151.967 35.4053 156.243C39.0533 160.52 44.0022 162.672 50.3084 162.672C52.3445 162.672 54.2674 162.474 56.0773 162.077C53.5322 159.642 49.5731 157.348 44.1153 155.167L48.8096 144.377C51.4678 144.858 53.5605 145.453 55.031 146.161C56.5298 146.869 59.4142 148.71 63.7409 151.74C64.759 152.448 65.8618 153.185 67.0496 153.921ZM40.1845 229.593C42.4751 234.917 45.9251 239.845 50.4781 244.433L50.9305 244.914C55.54 249.389 60.5737 252.787 66.0315 255.024C71.6025 257.318 77.7673 258.479 84.4977 258.479H129.348C134.891 258.479 139.359 262.982 139.359 268.505C139.359 269.694 139.161 270.855 138.765 271.932C137.125 278.275 135.23 284.506 133.138 290.566C130.932 296.938 128.528 303.084 125.898 308.946C124.767 311.58 123.466 314.157 122.024 316.706C130.706 312.77 138.85 308.295 146.485 303.254H146.514L146.485 303.226C154.912 297.703 162.689 291.586 169.872 284.846C177.14 278.02 183.757 270.572 189.781 262.558C191.732 259.952 194.729 258.564 197.755 258.564V258.536H236.243C242.973 258.536 249.138 257.375 254.709 255.081C260.337 252.759 265.54 249.219 270.291 244.489C275.013 239.76 278.52 234.577 280.839 228.97L281.065 228.403H302.048C301.313 231.207 300.408 233.926 299.305 236.588C295.968 244.687 290.991 252.079 284.374 258.706C277.757 265.276 270.404 270.261 262.316 273.603C254.228 276.944 245.547 278.644 236.271 278.644H202.619C196.709 286.148 190.346 293.087 183.531 299.487C175.443 307.105 166.733 313.987 157.429 320.076L157.401 320.048C148.041 326.222 138.058 331.631 127.51 336.247C116.962 340.863 105.735 344.715 93.8864 347.802C90.3798 348.708 86.4772 347.66 83.9039 344.743C80.2559 340.608 80.6518 334.293 84.7522 330.64C90.0404 325.938 94.5368 321.209 98.2696 316.451L98.6938 315.856C102.455 310.985 105.424 306.029 107.602 301.045L107.63 300.96C110.09 295.466 112.324 289.858 114.276 284.166C114.898 282.353 115.52 280.513 116.114 278.644H84.4977C75.2222 278.644 66.5405 276.944 58.4527 273.603C50.5912 270.346 43.4366 265.56 36.9607 259.272C36.7344 259.103 36.5365 258.904 36.3385 258.706C29.7778 252.136 24.8007 244.772 21.4638 236.616C19.9933 233.048 18.8621 229.366 18.0137 225.543C25.0269 227.582 32.4078 228.97 40.1845 229.593Z"
            fill="#001529"
          />
        </g>
        <defs>
          <clipPath id="clip0_6302_2">
            <rect width="315" height="348" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <Divider
        style={{ height: "90%", borderColor: "rgb(0 0 0 / 47%)" }}
        type="vertical"
        className="d-sm-block d-none"
      ></Divider>
      <Card>
        <label className="col-form-label fw-bold">Quiz Id:</label>
        <div className="d-flex">
          <Input
            placeholder="Paste Quiz Id"
            value={inputValue}
            onChange={onQuizChange}
          />
          <Button type="primary" onClick={navigate}>
            Go..
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Home;
