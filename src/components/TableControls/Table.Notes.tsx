import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'
import moment from 'moment'
import { INoteResponse } from '../../lib/interfaces/Note.interface'

export const NotesTable = ({ notes }: any | undefined) => {

  return (
    <TableContainer component={Paper}>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Note</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* no data */}
          {(!notes || notes.length <= 0) && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No data
              </TableCell>
            </TableRow>
          )}

          {/* data */}
          {notes &&
            notes.map((note: INoteResponse) => (
              <TableRow
                key={`project-table-row-${note._id}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}>
                {/* // cells */}
                <TableCell component="th" scope="row" width="60%">
                  {note.message}
                </TableCell>
                <TableCell width="20%">{note.user}</TableCell>
                <TableCell width="20%">{moment(note.date).format("DD MMM YYYY")}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
