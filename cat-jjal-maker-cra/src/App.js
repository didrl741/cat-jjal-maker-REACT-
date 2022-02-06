import logo from './logo.svg';
import React from "react";
import './App.css';
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};


const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px", border: "1px solid red" }} />
    </li>
  );
}


function Favorites({ favorites }) {

  if (favorites.length === 0) {
    return <div>하트를 눌러 사진을 저장해보세요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}





const FormTag = ({ updateMainCat }) => {

  const [value, setValue] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState("");

  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  function handleInputChange(e) {

    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다");
    }


    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (value === '') {
      setErrorMessage('빈 값으로 생성 불가!');
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit} >
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요"
        onChange={handleInputChange}
        value={value}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }} >{errorMessage}</p>
    </form>
  )
}


const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick} >{heartIcon}</button>
    </div>
  );
};



function Card(title, description) {
  return (
    <div>
      <h2>{title}</h2>
      {description}
    </div>
  );
}
<Card title="리액트~" description="리액트입니다" />


const App = () => {

  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  // const counterState = React.useState(
  //   jsonLocalStorage.getItem('counter') || 1
  // );

  // 새로고침 하기 전의 카운터 값을 가져오기 위해 로컬 스토리지에 접근하는것은 처음 한번만 해주면 된다.
  // 해결책 : 함수로 감싸주기.
  const counterState = React.useState(() => {
    return jsonLocalStorage.getItem('counter') || 1
  });

  const counter = counterState[0];
  const setCounter = counterState[1];

  const [mainCat, setMainCat] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(

    jsonLocalStorage.getItem("favorites") || []
  );


  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitCat() {
    const newCat = await fetchCat("First Cat");
    setMainCat(newCat);
  }


  React.useEffect(() => {
    setInitCat();
  }, []);

  React.useEffect(() => {
    console.log("counter가 바뀔때마다 실행");
  }, [counter]);


  // async function updateMainCat(value) {

  //   const newCat = await fetchCat(value);

  //   setMainCat(newCat);
  //   setCounter(counter + 1);

  //   jsonLocalStorage.setItem("counter", counter + 1);
  // };

  // 생성버튼을 연타하면 counter값이 별로 안올라가는 문제가 있었다.
  // 이렇게 해주면 클릭 수마다 counter값 잘 올라감.
  // setState와 usState의 인자를 값 대신 함수를 넘겨서 해결.

  async function updateMainCat(value) {

    const newCat = await fetchCat(value);

    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });


  };


  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div>
      <Title>{counter}번째 jjal(test)</Title>
      <FormTag updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
