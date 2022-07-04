import styled from 'styled-components';

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: red;
  height: 80px;
  font-size: 12px;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.svg`
  margin-right: 50px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
`;

function Header() {
  return (
    <Navigation>
      <Column>
        <Logo />
        <Items>
          <Item>Home</Item>
          <Item>TV Shows</Item>
        </Items>
      </Column>
      <Column>
        <button>Search</button>
      </Column>
    </Navigation>
  );
}

export default Header;
