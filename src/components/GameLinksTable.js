"use client"
import styled from "styled-components";
import { CiShare2 } from "react-icons/ci"

const Table = styled.table`
 width: 100%;
  border-collapse: separate; /* Changed from collapse */
  border-spacing: 0 10px; 
  font-size: .9rem;

    @media (max-width: 768px) {
    display: flex;  
    flex-direction: column;
    text-align: center;  
    justify-content: center; 
    align-items: center; 
    padding: 10px;
    position: relative;
    
  }
`;

const Th = styled.th`
  background-color:rgb(var(--background));
  color: rgb(var(--foreground));
  padding: 10px;
  border-bottom: 1px solid rgba(var(--theme-yellow), 0.8);
  text-align: left;
  font-weight: 400;

    &:nth-child(4) {
    text-align: right;
  }

    @media (max-width: 768px) {
    display: none; 
  }
`;

const Td = styled.td`
  padding: 10px;
  vertical-align: middle;

      /* Right-align only "Все даты" column */
  &:nth-child(4) {
    text-align: right;
  }

    @media (max-width: 768px) {
    display: flex;  
    flex-direction: column;
    text-align: left;
    padding: 10px;
    position: relative;
  }
`;

const GameNameTd = styled(Td)`
  color: rgb(var(--theme-yellow));
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  gap: 10px;

  @media (max-width: 768px) {
  justify-content: flex-start;
}

`;

const HoverRow = styled.tr`
  transition: all 0.3s ease-in-out;
   border: 1px solid rgba(var(--background), 1);
   border-radius: 5px;

   &:hover,
  &:focus-within {
    box-shadow: 0 0 0 1px rgba(var(--theme-yellow), 1); 
    border-radius: 5px;
    outline: none;
     & > td > button > svg {
      color: rgb(var(--theme-yellow)); 
    }
  }

   @media (max-width: 768px) {
    display: block;
    margin-bottom: 10px; 
    border: 1px solid rgba(var(--theme-yellow), 0.8);
    padding: 15px;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: rgb(var(--foreground));
  &:hover {
    color: rgb(var(--theme-yellow));
  }
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;

const ShareIcon = styled(CiShare2)`
color: rgb(var(--theme-grey));
&:hover {
color: rgb(var(--theme-yellow));
`

const GameNameContainer = styled.div`
  display: flex;
  align-items: center; /* Keep game name and button inline */
  gap: 8px;
  position: relative; /* Needed for absolute tooltip positioning */
`;

const GameNameSpan = styled.span`
  max-width: 225px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  cursor: pointer;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0; /* Align tooltip with the game name */
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  ${GameNameContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(-5px);
  }
`;


const GameShareButton = styled.button`
background: none;
border: 1px solid rgb(var(--theme-grey));
cursor: pointer;
padding: 5px;
margin-left: 8px;
display: flex;
align-items: center;
justify-content: center;
width: 30px; 
height: 30px; 
border-radius: 5px; 
transition: background 0.2s ease-in-out;

&:hover {
  border: 1px solid rgb(var(--theme-yellow));
}
`;

const GameLinksTable = ({ games, links }) => {
  if (!games || games.length === 0) {
    return <p>У вас пока что нет купленных игр</p>;
  }

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th>Дата покупки</Th>
          <Th>Название</Th>
          <Th>Тип ссылки</Th>
          <Th>Период действия</Th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <HoverRow key={link.id} tabIndex="0">
            <Td>{link.date}</Td>
            <GameNameTd>
              <GameNameContainer>
                <GameNameSpan>{link.game?.title || "Название отсутствует"}</GameNameSpan>
                <Tooltip>{link.game?.title || "Название отсутствует"}</Tooltip>
                <GameShareButton onClick={() => handleShare(link.url)}>
                  <CiShare2 size={18} color="rgb(var(--theme-yellow))" />
                </GameShareButton>
              </GameNameContainer>

            </GameNameTd>
            <Td>{link.type}</Td>
            <Td>
              <DateContainer>
                {link.startDate && link.endDate ? (
                  <span>{link.startDate} - {link.endDate}</span>
                ) : (
                  <span>{link.date}</span>
                )}
              </DateContainer>
            </Td>
          </HoverRow>
        ))}
      </tbody>
    </Table>
  );
};





export default GameLinksTable;