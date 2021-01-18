<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ProducerForm._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <asp:TextBox ID="updateStockTextbox" runat="server"></asp:TextBox>
    <asp:Button ID="UpdateStockButton" runat="server" Text="Change Stock" OnClick="UpdateStockButton_Click" />

</asp:Content>
