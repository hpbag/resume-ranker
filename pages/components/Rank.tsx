// @ts-nocheck
import React, { useState } from 'react';
import { FilePond, FilePondProps } from 'react-filepond';
import { Button, Container, Stack, Input, Box, Text } from '@chakra-ui/react';
import 'filepond/dist/filepond.min.css';

async function basicUpload(params) {
  const baseUrl = "https://api.upload.io";
  const path = `/v2/accounts/${params.accountId}/uploads/binary`;
  const entries = obj => Object.entries(obj).filter(([, val]) => (val ?? null) !== null);
  const query = entries(params.querystring ?? {})
    .flatMap(([k, v]) => Array.isArray(v) ? v.map(v2 => [k, v2]) : [[k, v]])
    .map(kv => kv.join("=")).join("&");
  const response = await fetch(`${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`, {
    method: "POST",
    body: params.requestBody,
    headers: Object.fromEntries(entries({
      "Authorization": `Bearer ${params.apiKey}`,
      "X-Upload-Metadata": JSON.stringify(params.metadata)
    }))
  });
  const result = await response.json();
  if (Math.floor(response.status / 100) !== 2)
    throw new Error(`Upload API Error: ${JSON.stringify(result)}`);
  return result;
}

type Props = {
  onRankingComplete: (rankedFiles: any[]) => void;
};

const Rank: React.FC<Props> = ({ onRankingComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [files, setFiles] = useState<FilePondProps['files']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getFileURL = async (file: File) => {
    try {
      const response = await basicUpload({
        accountId: "kW15bNi",
        apiKey: "public_kW15bNiBsv8eRyiHKhs9xRbDr8NB",
        requestBody: file,
      });
      console.log(`Success: ${JSON.stringify(response.fileUrl)}`);
      return response.fileUrl;
    } catch (error) {
      console.error(error);
    }
  };
  
  const getRank = async (file: File) => {
    const fileURL = await getFileURL(file);
    try {
      const requestBody = {
        fileURL,
        jobDescription,
        feedback,
      };
      console.log(requestBody);
      const response = await fetch("/api/spell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const output = await response.json();
      const parsedOutput = JSON.parse(output.outputs.output);
      
      console.log("score: ", parsedOutput.score);
      console.log("reasons: ", parsedOutput.reasons);
      return parsedOutput;
      
    } catch (e) {
      console.error("Error fetching or parsing data", e);
    }
  };
  

  const handleRanking = async () => {
    setError('');
    if (!jobDescription || !feedback) {
      setError('Make sure to fill out all fields!');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one file!');
      return;
    }
    
    console.log('Ranking started');
    setIsLoading(true);

    const rankedFiles = await Promise.all(files.map(async (file) => {
      const rank = await getRank(file);
      console.log(rank);
      return { file, score:rank.score, reasons:rank.reasons };
    }));

    rankedFiles.sort((a, b) => b.score - a.score);
    setIsLoading(false);

    console.log('Ranked files:', rankedFiles);
    onRankingComplete(rankedFiles);
  };

  return (
    <div>
      <Container>
        <div>
          {error && (
            <Box color='red' mb={2}>
              <Text fontSize='sm'>{error}</Text>
            </Box>
          )}
          
          <Stack spacing={3}>
            <Input
              placeholder='Job Description'
              size='md'
              onChange={(event) => setJobDescription(event.target.value)}
            />
            <Input
              placeholder='Preferences'
              size='md'
              onChange={(event) => setFeedback(event.target.value)}
            />
            <FilePond
              files={files}
              maxFiles={10}
              onupdatefiles={(fileItems) =>
                setFiles(fileItems.map(fileItem => fileItem.file))
              }
              allowMultiple={true}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={['application/pdf']}
            />
          </Stack>

          <Button
            color='#5344e5'
            border='1px solid #5344e5'
            colorScheme='whiteAlpha'
            isLoading={isLoading}
            loadingText='Ranking...'
            onClick={handleRanking}>Process
          </Button>

          {isLoading && (
            <Box color='gray.500' my={2}>
              <Text fontSize='sm'>Just a heads up: the file limit for this demo is 10 files. If you&#x27;d like access to a higher file limit, email me at hello@respell.ai :)    </Text>
            </Box>
          )}
          
        </div>
      </Container>
    </div>
  );
};

export default Rank;