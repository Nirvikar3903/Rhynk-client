import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AddMembersPanel from 'components/groups/AddMembersPanel'
import GroupDetailsModal from 'components/groups/GroupDetailsModal'

// Hardcoded for now — there's no contacts/users RTK Query endpoint yet (see
// [[05-state-data-layer]]); once one exists this becomes a query and this
// array goes away. `isSelf` marks the current user so they can't add
// themselves as a member of a group they're creating.
const MOCK_CONTACTS = [
  { id: '1', name: 'Jordan Smith', username: '@jsmith_audio', initials: 'JS', avatarColor: 'primary.main' },
  { id: '2', name: 'Maria Elena', username: '@maria_e', initials: 'ME', avatarColor: 'success.main', isSelf: true },
  { id: '3', name: 'Taylor Vance', username: '@tv_music', initials: 'TV', avatarColor: 'info.main' },
  { id: '4', name: 'Riley Blue', username: '@r_blue', initials: 'RB', avatarColor: 'warning.main' },
  { id: '5', name: 'Alex Rivera', username: '@alex_r', initials: 'AR', avatarColor: 'secondary.main' },
  { id: '6', name: 'Sarah Chen', username: '@sarah_c', initials: 'SC', avatarColor: 'error.main' },
]

// Owns the whole New Group flow: member selection (this page) and the group
// details modal it opens into. Single caller (this container), so the modal
// state lives here directly rather than in its own container file, per
// [[11-modal-flow-pattern]].
const NewGroupContainer = () => {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [musicRoomEnabled, setMusicRoomEnabled] = useState(true)

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return MOCK_CONTACTS
    return MOCK_CONTACTS.filter(
      (contact) => contact.name.toLowerCase().includes(query) || contact.username.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const selectedMembers = useMemo(
    () => MOCK_CONTACTS.filter((contact) => selectedIds.includes(contact.id)),
    [selectedIds],
  )

  const handleToggleMember = (contact) => {
    if (contact.isSelf) return
    setSelectedIds((prev) => (prev.includes(contact.id) ? prev.filter((id) => id !== contact.id) : [...prev, contact.id]))
  }

  const handleRemoveMember = (id) => setSelectedIds((prev) => prev.filter((memberId) => memberId !== id))

  const handleCreateGroup = () => {
    // No groups RTK Query endpoint exists yet (see [[05-state-data-layer]]) —
    // stub success rather than a real mutation until the backend contract is provided.
    setIsDetailsOpen(false)
    toast.success(`"${groupName}" created.`)
    navigate('/home')
  }

  return (
    <Box sx={{ width: '100%' }}>
      <AddMembersPanel
        canProceed={selectedMembers.length > 0}
        contacts={filteredContacts}
        onNextStep={() => setIsDetailsOpen(true)}
        onRemoveMember={handleRemoveMember}
        onSearchChange={setSearchQuery}
        onToggleMember={handleToggleMember}
        searchQuery={searchQuery}
        selectedIds={selectedIds}
        selectedMembers={selectedMembers}
      />

      <GroupDetailsModal
        canSubmit={groupName.trim().length > 0}
        description={description}
        groupName={groupName}
        musicRoomEnabled={musicRoomEnabled}
        onClose={() => setIsDetailsOpen(false)}
        onDescriptionChange={setDescription}
        onGroupNameChange={setGroupName}
        onMusicRoomToggle={setMusicRoomEnabled}
        onSubmit={handleCreateGroup}
        open={isDetailsOpen}
      />
    </Box>
  )
}

export default NewGroupContainer
