import type { NextPage } from 'next';
import React, { useState } from 'react';

import Rank from './components/Rank';
import styles from '../styles/Home.module.css';
import { Button, Container, Center, Text, Box, Link, Image, UnorderedList, ListItem } from '@chakra-ui/react';


const Home: NextPage = () => {
  const [rankedFiles, setRankedFiles] = useState<any[]>([]);

  const handleRankingComplete = (rankedFiles: any[]) => {
    setRankedFiles(rankedFiles);
    console.log('Ranking complete:', rankedFiles);
  };

  return (
    <Box h='100vh' w='100vw' className={styles.center}>
      <Container maxW='lg' my={10}>
        <Box py={8} px={4}>
          <Text fontSize='3xl' as='b' color='#5344e5'>Resume Ranker</Text>
          <Text fontSize='md' color='gray.700'>Get a ranked score and summary of each resume by uploading a job description, preferences, and a batch of resumes!</Text>
        </Box>
        <Rank onRankingComplete={handleRankingComplete} />
        
        <Box>
          {rankedFiles.map((file) => (
            <Box my={8} key={file.file.name} >
              <Text color='gray.700'><Text as='b'>File Name: </Text>{file.file.name}</Text>
              <Text as='b' color='#5344e5'>Score: {file.score}</Text>
              <br/>
              <Text as='b' color='gray.700'>Reasons:</Text>
              <UnorderedList mb={8}>
                {file.reasons.map((reason:any, index:number) => (
                  <ListItem key={index}>{reason}</ListItem>
                ))}
              </UnorderedList>
              <hr/>
            </Box>
          ))}
        </Box>
      </Container>
      <Center bg='#5344e5' h={20} position="fixed" bottom={0} w="100vw">
        <Link href='https://www.respell.ai/' color='#5344e5'>
          <Text color='white' >
            Made with 
            <Image src='/white.png' alt='Respell logo' h={6} px={2} display='inline-block'style={{ verticalAlign: 'bottom' }}/>
          </Text>
        </Link>
      </Center>
    </Box>
  );
};
export default Home;